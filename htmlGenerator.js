var HtmlGenerator = function() {
  /* Utility functions TODO: put somewhere else */
  var stripText = function (text, isFileName) {
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

  var isPage = function (title) {
    return title && title.toLowerCase().indexOf("content") < 0 && title.toLowerCase().indexOf("no sub-nav") < 0;
  };
  /* End of utility functions */
  
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
      self.pageContent(node)
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

  self.pageContent = function(node) {
    var contentNode = $(node).children('[text=Content]');
    if (contentNode.length == 0) {
      return 'Page content not found';
    }
    if (contentNode.children().first().attr('text')[0] == '#') {
      var nodeToFind = contentNode.children().first().attr('text').replace(/#/g, '');
      contentNode = $(node).children('[text*="' + nodeToFind + '"]').children('[text=Content]');
    }

    return $.makeArray(contentNode.children()).map(function(outline) {
      return self.placeholder(outline);
    }).join('');
  };

  self.placeholder = function(node) {
    var notesLines = stripText($(node).attr('_note')).split('\n');
    var notesClasses = [ 'placeholder' ];
    $.each(notesLines, function(index, line) {
      if (line.indexOf('#') > -1) {
        line = stripText(line).replace(/#/g, '').replace(/\(/g, '').replace(/\)/g, '');
        notesClasses = notesClasses.concat(line.split(' '));
      }
    });
    var heading = stripText($(node).attr('text'));
    return self.tag('div', self.tag('h2', heading), { className: notesClasses.join(' ').toLowerCase() });
  };
};