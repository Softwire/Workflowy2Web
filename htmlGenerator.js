var HtmlGenerator = function() {
  var self = this;

  self.getHtml = function(node, title, navigationObject, navLevel) {
    return self.docType() + self.tag('html', self.head(title, navLevel) + self.body(node, title, navigationObject));
  };

  self.docType = function () {
    return '<!doctype html>';
  };

  self.tag = function (tagName, content, attributes) {
    attributes = attributes || {};
    var attrString = Object.keys(attributes).map(function (item) {
      return (item == 'className' ? 'class' : item) + '="' + attributes[item] + '"';
    }).join(' ');
    attrString = attrString ? ' ' + attrString : '';
    return '<' + tagName + attrString + '>' + content + '</' + tagName + '>';
  };

  self.head = function (title, navLevel) {
    return self.tag('head',
      self.tag('title', title) +
      self.tag('link', '', { rel: 'stylesheet', href: '../'.repeat(navLevel + 1) + 'stylesheets/style.css' }) +
      self.tag('script', '', { src: '../'.repeat(navLevel + 1) + 'javascripts/jquery-2.1.4.min.js' }) +
      self.tag('script', '', { src: '../'.repeat(navLevel + 1) + 'javascripts/script.js' })
    );
  };

  self.body = function (node, title, navigationObject) {
    return self.tag('body',
      self.tag('h1', 'BBC Audiences') +
      self.navigation(navigationObject, title) +
      self.tag('p', 'Hello, this is a page.')
    );
  };

  self.navigation = function (navigationObject, title) {
    return navigationObject.map(function(navigationLinks) {
      return self.navigationBar(navigationLinks, title);
    }).join('');
  };

  self.navigationBar = function (navigationLinks, title) {
    return self.tag('div', navigationLinks.map(function(link) {
      var attributes = { href: link.path };
      if (title == link.displayText) {
        attributes.className = 'selected';
      }
      return self.tag('a', link.displayText, attributes);
    }).join(''), { className: 'localNav' });
  };
};