var Outline = function (node, siteTitle, generator, title, fileName, filePath, parentNavigationObject) {
  var navigationObject = parentNavigationObject.map(function (navBar) {
    return navBar.map(function (link) {
      return {
        displayText: link.displayText,
        path: '../' + link.path,
        selected: link.selected || link.displayText == title
      };
    });
  });
  var htmlPages = [];
  var navLevel = parentNavigationObject.length;

  this.process = function () {
    var childPages = getChildPages();
    updateNavigationObject(childPages);
    if (isPage(title)) {
      htmlPages.push({
        filePath: filePath + '/' + fileName + '.html',
        content: generator.generate(node, siteTitle, title, navigationObject, navLevel)
      });
    }
    processChildren(childPages);
    return htmlPages;
  };

  function getChildPages() {
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

  function updateNavigationObject(childPages) {
    if (childPages.length > 0) {
      navigationObject.push(childPages.map(function (childPage) {
        return { displayText: childPage.title, path: (fileName ? (fileName + '/') : '') + childPage.fileName + '.html', selected: false };
      }));
    }
  };

  function processChildren(childPages) {
    $.each(childPages, function (index, childPage) {
      var outline = new Outline(childPage.node, siteTitle, generator, childPage.title, childPage.fileName, filePath + '/' + fileName, navigationObject);
      htmlPages = htmlPages.concat(outline.process());
    });
  };
};