var Converter = function (xml) {
  this.source = xml;
  this.htmlPages = [];
  this.generator = new HtmlGenerator();

  this.GetZippedHtmlFiles = function () {
    var bodyNode = new Outline(this.source.find('body'), 'Top level title', '', '', []);
    this.htmlPages = bodyNode.process();
    this.htmlPages.shift();

    var zip = new JSZip();
    $.each(this.htmlPages, function (index, page) {
      zip.file(page.filePath.replace('//', ''), page.content);
    });

    return zip.generate({ type: 'blob' });
  };
}