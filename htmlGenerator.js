var HtmlGenerator = function () {
  this.docType = function() {
    return "<!doctype html>";
  };

  this.tag = function(tagName, content) {
    return "<" + tagName + ">" + content + "</" + tagName + ">";
  };

  this.head = function(title) {
    return this.tag("head",
      this.tag("title", title)
    );
  };

  this.navigation = function(links) {
    var listItems = "";
    for (var i = 0; i < links.length; i++) {
      listItems += this.tag("li", "<a href='" + links[i].href + "'>" + links[i].displayText + "</a>")
    }
    return this.tag("ul", listItems);
  };

  this.body = function (title, navigation) {
    return this.tag("body",
      navigation + this.tag("p", "Hello, this is " + title + ".")
    );
  };
}