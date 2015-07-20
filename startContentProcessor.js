// Dependent on DOM structure of workflowy
$('#exportAllButton').click();
var opml = $('#exportPopup').find('.opmlContainer').text();
$('#exportPopup').parent().find('.ui-icon-closethick').click();

var parsedOpml = $.parseXML(opml);
var xml = $(parsedOpml);

var converter = new Converter(xml);
saveAs(converter.GetZippedHtmlFiles(), "Prototype.zip");