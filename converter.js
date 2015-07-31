var Converter = function (xml) {
  var self = this;
  
  self.source = xml;
  self.htmlPages = [];
  self.generator = new HtmlGenerator();

  self.GetZippedHtmlFiles = function (callback) {
    var bodyNode = new Outline(self.source.find('body'), '', 'a', 'a', []);
    self.htmlPages = bodyNode.process();

    var zip = new JSZip();
    $.each(self.htmlPages, function (index, page) {
      zip.file(page.filePath, page.content);
    });
    
    //Import javascript and stylesheets
    async.series([
        function(callback) {
          self.addExistingFile(zip, chrome.extension.getURL('resources/style.txt'), 'stylesheets/style.css', callback);
        },
        function (callback) {
          self.addExistingFile(zip, chrome.extension.getURL('resources/jquery-2.1.4.txt'), 'javascripts/jquery-2.1.4.min.js', callback);
        },
        function(callback) {
          self.addExistingFile(zip, chrome.extension.getURL('resources/jquery-2.1.4.txt'), 'javascripts/script.js', callback);
        }
      ], function () {
      callback(zip.generate({ type: 'blob' }));
    });
  };

  self.addExistingFile = function (zip, filePath, zipPath, callback) {
    JSZipUtils.getBinaryContent(filePath, function (err, data) {
      if (err) {
        console.log('File failed to load', filePath, err);
      }
      zip.file(zipPath, data);
      callback(null, true);
    });
  };
}