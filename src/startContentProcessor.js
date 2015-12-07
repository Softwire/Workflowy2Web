define([
  'lib/jquery-2.1.4.min',
  'src/converter'
], function ($, Converter) {
  return function () {
    // Dependent on DOM structure and javascript of workflowy
    // exportIt is a custom workflowy function so can only be called in the page context
    var opml = extractOpmlData();
    var parsedOpml = $.parseXML(opml);
    var xml = $(parsedOpml);

    var siteTitle = $('.project.selected > .name').text();

    var converter = new Converter(xml, siteTitle);
    converter.GetZippedHtmlFiles(function (data) {
      saveAs(data, "Prototype.zip");
    });

    function extractOpmlData() {
      openExportPopup();
      switchToOpmlTab();
      var opml = getWorkflowyAsXml();
      closeExportPopup();
      return opml;
    }

    function switchToOpmlTab() {
      $('#id_opml').click()
    }

    function getWorkflowyAsXml() {
      return $('#exportPopup').find('.previewWindow.hasOpml').text();
    }

    function openExportPopup() {
      var script = document.createElement('script');
      var code = document.createTextNode('(function() {$(".project.selected").exportIt();})();');
      script.appendChild(code);
      document.head.appendChild(script);
    }

    function closeExportPopup() {
      $('#exportPopup').parent().find('.ui-icon-closethick').click();
    }
  }
});
