// Dependent on DOM structure and javascript of workflowy
// exportIt is a custom workflowy function so can only be called in the page context
var script = document.createElement('script');
var code = document.createTextNode('(function() {$(".project.selected").exportIt();})();');
script.appendChild(code);
document.head.appendChild(script);

var opml = $('#exportPopup').find('.opmlContainer').text();
$('#exportPopup').parent().find('.ui-icon-closethick').click();

var parsedOpml = $.parseXML(opml);
var xml = $(parsedOpml);

var siteTitle = $('.project.selected > .name').text();

var converter = new Converter(xml, siteTitle);
converter.GetZippedHtmlFiles(function (data) {
  saveAs(data, "Prototype.zip");
});