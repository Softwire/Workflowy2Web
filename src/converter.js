var Converter = function (xml, siteTitle) {
  this.GetZippedHtmlFiles = function (callback) {
    //TODO: Note this creates two nested folders called html which isn't the ideal file structure...
    var topNode = xml.find('body');
    // Ignore the top node if there is only one at that level and it matches the site title and it doesn't have a content node
    if (topNode.children().length == 1 &&
            stripText(siteTitle) == stripText(topNode.children().first().attr('text')) &&
            topNode.children().first().children('[text=Content]').length == 0) {
      topNode = topNode.children().first();
    }
    var bodyNode = new Outline(topNode, siteTitle, new HtmlGenerator(), '', 'html', 'html', []);
    var htmlPages = bodyNode.process();

    var zip = new JSZip();
    htmlPages.forEach(function (page) {
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