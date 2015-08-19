describe('outline', function() {
  var generator = new HtmlGenerator();
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
  var navObject = [[
    {
      displayText: 'Home',
      path: '../../home.html',
      selected: true
    },
    {
      displayText: 'Section',
      path: '../../section.html',
      selected: false
    }
  ],[
    {
      displayText: 'Top',
      path: '../top.html',
      selected: true
    },
    {
      displayText: 'Footer - tag',
      path: '../footertag.html',
      selected: false
    }
  ]];
  var expectedHtml = '<!doctype html><html><head><title>Footer - tag</title><link rel="stylesheet" href="../../../stylesheets/style.css"></link><script>window.onload = function() {var body = document.body;var list = [].slice.call(document.querySelectorAll("a"));function getParameterByName(name) {name = name.replace(/[[]/, "\\[").replace(/[]]/, "\\]");var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),results = regex.exec(location.search);return results === null ? "" : decodeURIComponent(results[1].replace(/+/g, " "));}function addNotes() {body.classList.add("notes");list.forEach(function(link) { link.setAttribute("href", link.getAttribute("href") + "?showNotes=1"); });}function removeNotes() {body.classList.remove("notes");list.forEach(function(link) { link.setAttribute("href", link.getAttribute("href").replace("?showNotes=1", "")); });}if (location.href.indexOf("?showNotes=1") > -1) {addNotes();}document.onkeypress = function(e) {var spaceKeyCode = 32;if (e.keyCode == spaceKeyCode && e.shiftKey) {if (body.classList.contains("notes")) {removeNotes();} else {addNotes();}}return false;};}</script></head><body><h1>Site Title</h1><div class="mainNav"><a href="../../home.html" class="selected">Home</a><a href="../../section.html">Section</a></div><div class="localNav"><a href="../top.html" class="selected">Top</a><a href="../footertag.html">Footer - tag</a></div><div class="placeholder"><h2>Something - or other</h2><span class="note"></span></div><div class="placeholder"><h2>TV – Quarterly Reach / Share / Av Time</h2><span class="note"></span></div></body></html>';

  describe('generate', function() {
    it('returns the correct HTML', function() {
      var result = generator.generate($($($.parseXML(opml)).find('body').children()[1]),
          'Site Title', 'Footer - tag', navObject, 2);
      expect(result).toEqual(expectedHtml);
    });
  });
});