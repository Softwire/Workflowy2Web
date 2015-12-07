define([
  'src/outline'
], function(Outline) {

  describe('outline', function () {
    var outline;

    beforeEach(function () {
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
          '<outline text="TV � Quarterly Reach / Share / Av Time" /></outline>' +
          '</outline>' +
          '<outline text="~Ignore" />' +
          '</body>' +
          '</opml>';
      var generator = {
        generate: function (node, siteTitle, title, navigationObject, navLevel) {
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

    describe('process', function () {
      it('returns a list of html pages with structured file paths', function () {
        var result = outline.process();
        expect(result.length).toBe(4);
        expect(result[0].filePath).toEqual('/path/to/pageTitle.html');
        expect(result[1].filePath).toEqual('/path/to/pageTitle/top.html');
        expect(result[2].filePath).toEqual('/path/to/pageTitle/footertag.html');
        expect(result[3].filePath).toEqual('/path/to/pageTitle/footertag/print.html');
      });

      it('calls the generator with the correct title for each page', function () {
        var result = outline.process();
        expect(result[0].content[2]).toEqual('Page Title');
        expect(result[1].content[2]).toEqual('Top');
        expect(result[2].content[2]).toEqual('Footer - tag');
        expect(result[3].content[2]).toEqual('Print');
      });

      it('calls the generator with the navigation object for the page', function () {
        var result = outline.process();
        expect(result[0].content[3].length).toEqual(2);
        expect(result[3].content[3][2][0].path).toEqual('../footertag/print.html');
      });

      it('sets the selected state of parent pages in the navigation object', function () {
        var result = outline.process();
        expect(result[3].content[3][0][0].selected).toEqual(true);
        expect(result[3].content[3][1][1].selected).toEqual(true);
        expect(result[3].content[3][2][0].selected).toEqual(true);
      });

      it('calls the generator with the navigation level of the page', function () {
        var result = outline.process();
        expect(result[0].content[4]).toEqual(1);
        expect(result[1].content[4]).toEqual(2);
        expect(result[2].content[4]).toEqual(2);
        expect(result[3].content[4]).toEqual(3);
      });
    });
  });
});