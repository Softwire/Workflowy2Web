var Converter = function (xml, siteTitle) {
  var source = xml;

  this.GetZippedHtmlFiles = function (callback) {
    var bodyNode = new Outline(source.find('body'), siteTitle, new HtmlGenerator(), '', 'a', 'a', []);
    var htmlPages = bodyNode.process();

    var zip = new JSZip();
    $.each(htmlPages, function (index, page) {
      zip.file(page.filePath, page.content);
    });

    var imageFileNames = ['bar-graph', 'contact', 'episode', 'genre-tags', 'headline',
      'image' ,'line-graph', 'pie-chart', 'programme', 'quarter', 'quote', 'report'];
    
    //Import javascript and stylesheets
    async.series([
        function (callback) {
          addExistingFile(zip, chrome.extension.getURL('resources/style.txt'), 'stylesheets/style.css', callback);
        }
      ].concat(imageFileNames.map(function(imageFileName) {
        return function (callback) {
          addExistingFile(zip, chrome.extension.getURL('resources/images/' + imageFileName + '.png'), 'images/' + imageFileName + '.png', callback);
        };
      })), function () {
      callback(zip.generate({ type: 'blob' }));
    });
  };

  function addExistingFile(zip, filePath, zipPath, callback) {
    JSZipUtils.getBinaryContent(filePath, function (err, data) {
      if (err) {
        console.log('File failed to load', filePath, err);
      }
      zip.file(zipPath, data);
      callback(null, true);
    });
  };
}