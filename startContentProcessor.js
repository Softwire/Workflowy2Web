// Dependent on DOM structure of workflowy
$('#exportAllButton').click();
var opml = $('#exportPopup').find('.opmlContainer').text();
$('#exportPopup').parent().find('.ui-icon-closethick').click();

var parsedOpml = $.parseXML(opml);
var xml = $(parsedOpml);

var converter = new Converter(xml);
converter.GetZippedHtmlFiles(function (data) {
  saveAs(data, "Prototype.zip");
});