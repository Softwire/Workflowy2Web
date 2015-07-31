var Outline = function (node, title, fileName, filePath, parentNavigationObject) {
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
    return title && title.toLowerCase() != "content" && title.toLowerCase().indexOf("no sub-nav") < 0;
  };
  /* End of utility functions */
  
  var self = this;
  self.node = node;
  self.generator = new HtmlGenerator();
  self.title = title;
  self.fileName = fileName;
  self.filePath = filePath;
  self.navigationObject = parentNavigationObject.map(function (navBar) {
    return navBar.map(function (link) {
      return {
        displayText: link.displayText,
        path: '../' + link.path
      };
    });
  });
  self.htmlPages = [];
  self.navLevel = parentNavigationObject.length;

  self.process = function () {
    var childPages = self.getChildPages();
    self.updateNavigationObject(childPages);
    if (isPage(self.title)) {
      self.htmlPages.push({
        filePath: self.filePath + '/' + self.fileName + '.html',
        content: self.generator.getHtml(self.node, self.title, self.navigationObject, self.navLevel)
      });
    }
    self.processChildren(childPages);
    return self.htmlPages;
  };

  self.getChildPages = function () {
    var pages = [];
    $.each($(node).children(), function (index, child) {
      var childTitle = stripText($(child).attr('text'));
      if (isPage(childTitle)) {
        if (childTitle[0] == '[') {
          $.each(childTitle.substring(1, childTitle.length - 1).split(','), function(index, subTitle) {
            pages.push({ title: subTitle, fileName: stripText(subTitle, true).toLowerCase(), node: child });
          });
        } else {
          pages.push({ title: childTitle, fileName: stripText(childTitle, true).toLowerCase(), node: child });
        }
      }
    });
    return pages;
  };

  self.updateNavigationObject = function(childPages) {
    if (childPages.length > 0) {
      self.navigationObject.push(childPages.map(function (childPage) {
        return { displayText: childPage.title, path: (self.fileName ? (self.fileName + '/') : '') + childPage.fileName + '.html' };
      }));
    }
  };

  self.processChildren = function(childPages) {
    $.each(childPages, function (index, childPage) {
      var outline = new Outline(childPage.node, childPage.title, childPage.fileName, self.filePath + '/' + self.fileName, self.navigationObject);
      self.htmlPages = self.htmlPages.concat(outline.process());
    });
  };
};