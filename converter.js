var Converter = function (xml) {
  this.source = xml;
  this.htmlPages = [];
  this.generator = new HtmlGenerator();

  this.GetZippedHtmlFiles = function () {
    var bodyNode = new Outline(this.source.find('body'), '', 'a', 'a', []);
    this.htmlPages = bodyNode.process();

    var zip = new JSZip();
    $.each(this.htmlPages, function (index, page) {
      zip.file(page.filePath.replace('//', ''), page.content);
    });

    return zip.generate({ type: 'blob' });
  };
}