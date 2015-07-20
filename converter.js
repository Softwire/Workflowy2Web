var Converter = function (xml) {
  this.source = xml;
  this.htmlPages = [];

  this.GetZippedHtmlFiles = function () {
    this.processNode(this.source.find('body'), '');

    var zip = new JSZip();
    $.each(this.htmlPages, function (index, page) {
      zip.file(page.filePath, page.content);
    });

    return zip.generate({ type: "blob" });
  };

  this.processNode = function (node, path) {
    var title = stripText(node.attr('text'));
    var fileName = stripText(title, [/ /g, /&amp;/g, /'/g]).toLowerCase();
    if (title && path == '') {
      this.htmlPages.push({
        title: title,
        filePath: path + fileName + '.html',
        content: getPageContent(node)
      });
    }
    var self = this;
    $.each(node.children(), function (index, child) {
      self.processNode($(child), path + (fileName == '' ? '' : (fileName + '/')));
    });
  };

  var getPageContent = function (node) {
    var title = stripText(node.attr('text'));
    return "<!doctype html><html><head><title>" + title + "</title></head><body><p>Hello, this is " + title + "</p></body></html>";
  };

  var stripText = function (text, additional) {
    if (!text) {
      return '';
    }
    var stringsToRemove = [/<b>/g, /<\/b>/g, /<i>/g, /<\/i>/g];
    stringsToRemove = stringsToRemove.concat(additional);
    $.each(stringsToRemove, function (index, stringToRemove) {
      text = text.replace(stringToRemove, '');
    });
    return text.trim();
  };
}