function stripText(text, isFileName) {
  if (!text) {
    return '';
  }
  var stringsToRemove = [/<b>/g, /<\/b>/g, /<i>/g, /<\/i>/g];
  $.each(stringsToRemove, function (index, stringToRemove) {
    text = text.replace(stringToRemove, '');
  });
  if (isFileName) {
    text = text.replace(/[^a-zA-Z0-9]+/g, "");
  }
  return text.trim();
};

function isPage(title) {
  return title && title.toLowerCase() != "content" && title.toLowerCase().indexOf("no sub-nav") < 0 && title.indexOf("~") != 0;
};