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
  /* End of utility functions */
  
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
      self.notesToggleFunction()
    );
  };

  self.body = function (node, navigationObject) {
    return self.tag('body',
      self.tag('h1', 'BBC Audiences') +
      self.navigation(navigationObject) +
      self.pageContent(node)
    );
  };

  self.navigation = function (navigationObject) {
    return navigationObject.map(function(navigationLinks, index) {
      return self.navigationBar(navigationLinks, index == 0);
    }).join('');
  };

  self.navigationBar = function (navigationLinks, mainNav) {
    return self.tag('div', navigationLinks.map(function(link) {
      var attributes = { href: link.path };
      if (link.selected) {
        attributes.className = 'selected';
      }
      return self.tag('a', link.displayText, attributes);
    }).join(''), { className: mainNav ? 'mainNav' : 'localNav' });
  };

  self.pageContent = function(node) {
    var contentNode = $(node).children('[text=Content]');
    if (contentNode.length == 0) {
      return self.tag('div', self.getNotes(node).join('\n'), { className: 'contentMissing' });
    }
    if (contentNode.children().first().attr('text')[0] == '#') {
      var nodeToFind = contentNode.children().first().attr('text').replace(/#/g, '');
      contentNode = $(node).children('[text*="' + nodeToFind + '"]').children('[text=Content]');
    }

    return $.makeArray(contentNode.children()).map(function(outline) {
      return self.placeholder(outline);
    }).join('');
  };

  self.placeholder = function (node) {
    var notesLines = self.getNotes(node);
    var notesClasses = [ 'placeholder' ];
    $.each(notesLines, function (index, line) {
      notesClasses = notesClasses.concat(line.split(' ').filter(function(word) {
        return word.indexOf('#') == 0;
      }).map(function(className) {
        return className.substring(1);
      }));
    });
    var heading = stripText($(node).attr('text'));
    return self.tag('div', self.tag('h2', heading) + self.tag('span', notesLines.join('\n'), { className: 'note' }), { className: notesClasses.join(' ').toLowerCase() });
  };

  self.getNotes = function(node) {
    return stripText($(node).attr('_note')).split('\n').filter(function(line) {
      return line.indexOf('~') != 0;
    });
  };

  self.notesToggleFunction = function () {
    return self.tag('script',
      'document.onkeypress = function(e) {' +
        'var body = document.body;' +
        'var spaceKeyCode = 32;' +
        'if (e.keyCode == spaceKeyCode && e.shiftKey) {' +
          'if (body.classList.contains("notes")) {' +
            'body.classList.remove("notes");' +
          '} else {' +
            'body.classList.add("notes");' +
          '}' +
        '}' +
        'return false;' +
      '};'
    );
  };
};