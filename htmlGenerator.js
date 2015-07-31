var HtmlGenerator = function() {
  var self = this;

  self.getHtml = function(node, title, navigationObject, navLevel) {
    return self.docType() + self.tag('html', self.head(title, navLevel) + self.body(node, navigationObject));
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

  self.body = function (node, navigationObject) {
    return self.tag('body',
      self.tag('h1', 'BBC Audiences') +
      self.navigation(navigationObject) +
      self.tag('p', 'Hello, this is a page.')
    );
  };

  self.navigation = function (navigationObject) {
    return navigationObject.map(function(navigationLinks) {
      return self.navigationBar(navigationLinks);
    }).join('');
  };

  self.navigationBar = function (navigationLinks) {
    return self.tag('div', navigationLinks.map(function(link) {
      return self.tag('a', link.displayText, { href: link.path });
    }).join(''), { className: 'localNav' });
  };
};