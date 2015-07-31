var HtmlGenerator = function() {
  var self = this;

  self.getHtml = function(node, title, navigationObject) {
    return self.docType() + self.tag('html', self.head(title) + self.body(node, navigationObject));
  };

  self.docType = function () {
    return '<!doctype html>';
  };

  self.tag = function (tagName, content, attributes) {
    attributes = attributes || {};
    var attrString = Object.keys(attributes).map(function(item) {
       return item + '="' + attributes[item] + '"';
    }).join(' ');
    return '<' + tagName + ' ' + attrString + '>' + content + '</' + tagName + '>';
  };

  self.head = function (title) {
    return self.tag('head',
      self.tag('title', title)
    );
  };

  self.body = function (node, navigationObject) {
    return self.tag('body',
      self.navigation(navigationObject) + self.tag('p', 'Hello, this is a page.')
    );
  };

  self.navigation = function (navigationObject) {
    return navigationObject.map(function(navigationLinks) {
      return self.navigationBar(navigationLinks);
    }).join('');
  };

  self.navigationBar = function (navigationLinks) {
    return self.tag('ul', navigationLinks.map(function(link) {
      return self.tag("li", self.tag('a', link.displayText, { href: link.path }));
    }).join(''));
  };
};