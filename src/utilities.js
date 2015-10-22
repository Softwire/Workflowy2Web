function stripText(text, isFileName) {
  if (!text) {
    return '';
  }
  var stringsToRemove = [/<b>/g, /<\/b>/g, /<i>/g, /<\/i>/g];
  stringsToRemove.forEach(function (stringToRemove) {
    text = text.replace(stringToRemove, '');
  });
  if (isFileName) {
    text = text.replace(/[^a-zA-Z0-9]+/g, "");
  }
  return text.trim();
};

function isPage(title) {
  return title && title.toLowerCase() != "content" && title.indexOf("~") != 0;
};