describe('outline', function() {
  var outline;

  beforeEach(function() {
    var opml = '<?xml version="1.0"?>' +
'<opml version="2.0">' +
  '<head>' +
    '<ownerEmail>sat@softwire.com</ownerEmail>' +
  '</head>' +
  '<body>' +
    '<outline text="Top" />' +
    '<outline text="Footer - tag" _note="This is a footer note to export&#10;~Dont export this" >' +
      '<outline text="~Ignore" />' +
      '<outline text="Print" />' +
      '<outline text="Content" >' +
        '<outline text="Something - or other" />' +
        '<outline text="TV – Quarterly Reach / Share / Av Time" /></outline>' +
    '</outline>' +
    '<outline text="~Ignore" />' +
  '</body>' +
'</opml>';
    var generator = {
      generate: function(node, siteTitle, title, navigationObject, navLevel) {
        return arguments;
      }
    };
    outline = new Outline(
      $($.parseXML(opml)).find('body'),
      'Site Title',
      generator,
      'Page Title', 
      'pageTitle', 
      '/path/to', 
      [[
        {
          displayText: 'Home',
          path: 'path/to/home.html',
          selected: true
        },
        {
          displayText: 'Section',
          path: 'path/to/section.html',
          selected: false
        }
      ]]);
  });

  describe('process', function() {
    it('returns a list of html pages with structured file paths', function() {
      var result = outline.process();
      function filePathForPage(pageNumber) {
        return result[pageNumber].filePath;
      }

      expect(result.length).toBe(4);
      expect(filePathForPage(0)).toEqual('/path/to/pageTitle.html');
      expect(filePathForPage(1)).toEqual('/path/to/pageTitle/top.html');
      expect(filePathForPage(2)).toEqual('/path/to/pageTitle/footertag.html');
      expect(filePathForPage(3)).toEqual('/path/to/pageTitle/footertag/print.html');
    });

    it('calls the generator with the correct title for each page', function() {
      var result = outline.process();
      function titleForPage(pageIndex) {
        return result[pageIndex].content[2];
      }

      expect(titleForPage(0)).toEqual('Page Title');
      expect(titleForPage(1)).toEqual('Top');
      expect(titleForPage(2)).toEqual('Footer - tag');
      expect(titleForPage(3)).toEqual('Print');
    });
    
    it('calls the generator with the navigation object for the page', function() {
      var result = outline.process();
      expect(navObjectForPage(result, 0).length).toEqual(2);
      expect(navObjectForPage(result, 3)[2][0].path).toEqual('../footertag/print.html');
    });
    
    it('sets the selected state of parent pages in the navigation object', function() {
      var result = outline.process();
      expect(navObjectForPage(result, 3)[0][0].selected).toEqual(true);
      expect(navObjectForPage(result, 3)[1][1].selected).toEqual(true);
      expect(navObjectForPage(result, 3)[2][0].selected).toEqual(true);
    });
    
    it('calls the generator with the navigation level of the page', function() {
      var result = outline.process();
      function navLevelForPage(pageNumber) {
        return result[pageNumber].content[4];
      }

      expect(navLevelForPage(0)).toEqual(1);
      expect(navLevelForPage(1)).toEqual(2);
      expect(navLevelForPage(2)).toEqual(2);
      expect(navLevelForPage(3)).toEqual(3);
    });
  });

  function navObjectForPage(result, pageNumber) {
    return result[pageNumber].content[3];
  }
});
