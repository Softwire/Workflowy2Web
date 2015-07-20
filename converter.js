var Converter = function (xml) {
  this.source = xml;
  this.htmlPages = [];
  this.generator = new HtmlGenerator();

  this.GetZippedHtmlFiles = function () {
    this.processNode(this.source.find('body'), '', '');

    var zip = new JSZip();
    $.each(this.htmlPages, function (index, page) {
      zip.file(page.filePath, page.content);
    });

    return zip.generate({ type: "blob" });
  };

  this.processNode = function (node, path, navigation) {
    var title = stripText(node.attr('text'));
    var fileName = stripText(title, [/ /g, /&amp;/g, /'/g]).toLowerCase();
    if (title && path == '') {
      this.htmlPages.push({
        title: title,
        filePath: path + fileName + '.html',
        content: this.getPageContent(node, navigation)
      });
    }
    navigation = navigation + this.getNavContent(node, path);
    var self = this;
    $.each(node.children(), function (index, child) {
      self.processNode($(child), path + (fileName == '' ? '' : (fileName + '/')), navigation);
    });
  };

  this.getPageContent = function (node, navigation) {
    var title = stripText(node.attr('text'));
    return this.generator.docType() + this.generator.tag("html",
      this.generator.head(title) + this.generator.body(title, navigation)
    );
  };

  this.getNavContent = function (node, path) {
    var links = [];
    $.each(node.children(), function (index, child) {
      var title = stripText($(child).attr('text'));
      var fileName = stripText(title, [/ /g, /&amp;/g, /'/g]).toLowerCase();
      if (title) {
        links.push({ displayText: title, href: path + fileName + '.html' });
      }
    });
    return this.generator.navigation(links);
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