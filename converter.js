// Utility functions (move out into separate file).
var stripText = function(text, additional) {
  var stringsToRemove = [ /<b>/g, /<\/b>/g, /<i>/g, /<\/i>/g ];
  stringsToRemove = stringsToRemove.concat(additional);
  $.each(stringsToRemove, function(index, stringToRemove) {
    text = text.replace(stringToRemove, '')
  });
  return text.trim();
};
// End of Utility functions

var projectTitle = $('.mainTreeRoot').find('.name').first().text();

// Dependent on DOM structure of workflowy
$('#exportAllButton').click();
var opml = $('#exportPopup').find('.opmlContainer').text();
$('#exportPopup').parent().find('.ui-icon-closethick').click();

var parsedOpml = $.parseXML(opml);
var $xml = $(parsedOpml);
var titles = $.map($xml.find('body').children(), function(outline) {
  return {
    name: stripText(outline.getAttribute('text')),
	filename: stripText(outline.getAttribute('text'), [ / /g, /&amp;/g, /'/g ]).toLowerCase()
  }
});

var navLinks = $.map(titles, function(title) {
  return "<a href='" + title.filename + ".html'>" + title.name + "</a>";
}).join("   |   ");

var zip = new JSZip();
$.each(titles, function(index, title) {
  zip.file(title.filename + ".html", "<!doctype html><html><head><title>" + title.name + "</title></head><body>" + navLinks + "<p>Hello, this is " + title.name + "</p></body></html>");
});

var blob = zip.generate({ type : "blob" });
saveAs(blob, "Prototype.zip");