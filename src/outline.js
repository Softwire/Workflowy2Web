﻿var Outline = function (node, title, fileName, filePath, parentNavigationObject) {
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

  this.process = function (siteTitle, generator) {
    var childPages = getChildPages();
    updateNavigationObject(childPages);
    if (isPage(title)) {
      htmlPages.push({
        filePath: filePath + '/' + fileName + '.html',
        content: generator.generate(node, siteTitle, title, navigationObject, navLevel)
      });
    }
    processChildren(childPages, siteTitle, generator);
    return htmlPages;
  };

  function getChildPages() {
    var pages = [];
    $.each($(node).children(), function (index, child) {
      var childTitle = getTitle(child);
      if (isPage(childTitle)) {
        getChildTitles(childTitle).map(function(subTitle) {
          pages.push({ title: subTitle, fileName: stripText(subTitle, true).toLowerCase(), node: child });
        });
      }
    });
    return pages;
  };

  function getChildTitles(childTitle) {
    if (childTitle[0] == '[') {
      return childTitle.substring(1, childTitle.length - 1).split(',')
    } else {
      return [childTitle];
    }
  }


  function updateNavigationObject(childPages) {
    if (childPages.length > 0) {
      navigationObject.push(childPages.map(function (childPage) {
        return { displayText: childPage.title, path: (fileName || filePath) + '/' + childPage.fileName + '.html', selected: false };
      }));
    }
  };

  function processChildren(childPages, siteTitle, generator) {
    $.each(childPages, function (index, childPage) {
      var path = fileName ? filePath + '/' + fileName : filePath;
      var outline = new Outline(childPage.node, childPage.title, childPage.fileName, path, navigationObject);
      htmlPages = htmlPages.concat(outline.process(siteTitle, generator));
    });
  };
};
