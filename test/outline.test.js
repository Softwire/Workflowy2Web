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
    var result;
    beforeEach(function() {
      result = outline.process();
    });

    it('returns a list of html pages with structured file paths', function() {
      expect(result.length).toBe(4);
      expect(filePathForPage(0)).toEqual('/path/to/pageTitle.html');
      expect(filePathForPage(1)).toEqual('/path/to/pageTitle/top.html');
      expect(filePathForPage(2)).toEqual('/path/to/pageTitle/footertag.html');
      expect(filePathForPage(3)).toEqual('/path/to/pageTitle/footertag/print.html');
    });

    it('calls the generator with the correct title for each page', function() {
      expect(titleForPage(0)).toEqual('Page Title');
      expect(titleForPage(1)).toEqual('Top');
      expect(titleForPage(2)).toEqual('Footer - tag');
      expect(titleForPage(3)).toEqual('Print');
    });
    
    it('calls the generator with the navigation object for the page', function() {
      expect(navObjectForPage(0).length).toEqual(2);
      expect(navObjectForPage(3)[2][0].path).toEqual('../footertag/print.html');
    });
    
    it('sets the selected state of parent pages in the navigation object', function() {
      expect(navObjectForPage(3)[0][0].selected).toEqual(true);
      expect(navObjectForPage(3)[1][1].selected).toEqual(true);
      expect(navObjectForPage(3)[2][0].selected).toEqual(true);
    });
    
    it('calls the generator with the navigation level of the page', function() {
      expect(navLevelForPage(0)).toEqual(1);
      expect(navLevelForPage(1)).toEqual(2);
      expect(navLevelForPage(2)).toEqual(2);
      expect(navLevelForPage(3)).toEqual(3);
    });

    var pageFields = {
      title: 2,
      navObject: 3,
      navLevel: 4
    };

    function filePathForPage(pageNumber) {
      return result[pageNumber].filePath;
    }

    function pageContent(pageNumber, field) {
      return result[pageNumber].content[pageFields[field]];
    }

    function titleForPage(pageNumber) {
      return pageContent(pageNumber, 'title');
    }

    function navObjectForPage(pageNumber) {
      return pageContent(pageNumber, 'navObject');
    }

    function navLevelForPage(pageNumber) {
      return pageContent(pageNumber, 'navLevel');
    }
  });
});
