define([
  'src/utilities'
], function(Util) {
  return function() {
    this.generate = function (node, siteTitle, title, navigationObject, navLevel) {
      var doc = docType() + tag('html', head(title, navLevel) + body(node, siteTitle, navigationObject));
      // There must be a better way to convert the character set?
      var dashRegex = new RegExp(String.fromCharCode(8211), 'g');
      var spaceRegex = new RegExp(String.fromCharCode(160), 'g');
      return doc.replace(dashRegex, '-').replace(spaceRegex, ' ');
    };

    function docType() {
      return '<!doctype html>';
    }

    function tag(tagName, content, attributes) {
      attributes = attributes || {};
      var attrString = Object.keys(attributes).map(function (item) {
        return (item == 'className' ? 'class' : item) + '="' + attributes[item] + '"';
      }).join(' ');
      attrString = attrString ? ' ' + attrString : '';
      return '<' + tagName + attrString + '>' + content + '</' + tagName + '>';
    }

    function head(title, navLevel) {
      return tag('head',
          tag('title', title) +
          tag('link', '', { rel: 'stylesheet', href: '../'.repeat(navLevel) + 'stylesheets/style.css' }) +
          notesToggleFunction()
      );
    }

    function body(node, siteTitle, navigationObject) {
      return tag('body',
          tag('h1', siteTitle) +
          navigation(navigationObject) +
          pageContent(node)
      );
    }

    function navigation(navigationObject) {
      return navigationObject.map(function(navigationLinks, index) {
        return navigationBar(navigationLinks, index == 0);
      }).join('');
    }

    function navigationBar(navigationLinks, mainNav) {
      return tag('div', navigationLinks.map(function(link) {
        var attributes = { href: link.path };
        if (link.selected) {
          attributes.className = 'selected';
        }
        return tag('a', link.displayText, attributes);
      }).join(''), { className: mainNav ? 'mainNav' : 'localNav' });
    }

    function pageContent(node) {
      var contentNode = $(node).children('[text=Content]');
      if (contentNode.length == 0) {
        return tag('div', getNotes(node).join('\n'), { className: 'contentMissing' });
      }
      if (contentNode.children().first().attr('text').match(/##.+##/)) {
        var nodeToFind = contentNode.children().first().attr('text').replace(/#/g, '');
        contentNode = $(node).children('[text*="' + nodeToFind + '"]').children('[text=Content]');
      }

      return $.makeArray(contentNode.children()).map(function(outline) {
        return placeholder(outline, 2);
      }).join('');
    }

    function placeholder(node, headingLevel) {
      var notesLines = getNotes(node);
      var contentBlockLevelClass = headingLevel < 7 ? 'content-block-level-' + headingLevel : 'content-block-text'
      var notesClasses = [ 'placeholder', contentBlockLevelClass ];
      $.each(notesLines, function (index, line) {
        notesClasses = notesClasses.concat(line.split(' ').filter(function(word) {
          return word.indexOf('#') == 0;
        }).map(function(className) {
          return className.substring(1);
        }));
      });
      var heading = Util.stripText($(node).attr('text'));
      var childContent = $.makeArray($(node).children()).map(function (outline) {
        return placeholder(outline, headingLevel + 1);
      }).join('');
      var headingTag = headingLevel < 7 ? 'h' + headingLevel : 'span';
      return tag('div', tag(headingTag, heading) + tag('span', notesLines.join('\n'), { className: 'note' }) + childContent, { className: notesClasses.join(' ').toLowerCase() });
    }

    function getNotes(node) {
      return Util.stripText($(node).attr('_note')).split('\n').filter(function(line) {
        return line.indexOf('~') != 0;
      });
    }

    function notesToggleFunction() {
      return tag('script',
          'window.onload = function() {' +
          'var body = document.body;' +
          'var list = [].slice.call(document.querySelectorAll("a"));' +
          'function getParameterByName(name) {' +
          'name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");' +
          'var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),' +
          'results = regex.exec(location.search);' +
          'return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));' +
          '}' +
          'function addNotes() {' +
          'body.classList.add("notes");' +
          'list.forEach(function(link) { link.setAttribute("href", link.getAttribute("href") + "?showNotes=1"); });' +
          '}' +
          'function removeNotes() {' +
          'body.classList.remove("notes");' +
          'list.forEach(function(link) { link.setAttribute("href", link.getAttribute("href").replace("?showNotes=1", "")); });' +
          '}' +

          'if (location.href.indexOf("?showNotes=1") > -1) {' +
          'addNotes();' +
          '}' +

          'document.onkeypress = function(e) {' +
          'var spaceKeyCode = 32;' +
          'if (e.keyCode == spaceKeyCode && e.shiftKey) {' +
          'if (body.classList.contains("notes")) {' +
          'removeNotes();' +
          '} else {' +
          'addNotes();' +
          '}' +
          '}' +
          'return false;' +
          '};' +
          '}'
      );
    }
  }
});
