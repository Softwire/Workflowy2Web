
var audiences = {};


function stringAsText(stringToConvert) {
  var string = "<b>" + stringToConvert + "</b>";

  if ($(string).text().length > 0) {
    return $(string).text();
  } else {
    return string
  }
}


function createUrlString(topicsArray, selectedTopic, urlBase) {

  return topicsArray.map(function (topic) {
    var topicIsSelected = selectedTopic === topic.url ? "selected" : "";

    return "<a href='javascript:setUrl(\"" + urlBase + "/"
        + topic.url
        + "\")' class='" + topic.url + " " + topicIsSelected + "'>"
        + topic.name +
        "</a>";
  });
}






function loadData() {
  var dataFile = "/javascripts/content/workflowy.json";

  $.getJSON(dataFile, function (data) {
    audiences.rawData = data;
    loadTopics();
  });
}


function loadTopics() {

  audiences.mainTopics = getMainTopics();


  var urlMainTopic = getMainTopicFromUrl(audiences.mainTopics);
  if (urlMainTopic.length === 0) {
    urlMainTopic = audiences.mainTopics[0].url;
  }



  addMainTopicsToHtml(audiences.mainTopics, urlMainTopic);

  if (isDefined(urlMainTopic)) {
    var subTopics = getSubTopics(urlMainTopic, urlSubTopic);
    var urlSubTopic = getSubTopicFromUrl(audiences.mainTopics, subTopics);

    addSubTopicsToHtml(removeContentTopic(subTopics), urlSubTopic, urlMainTopic);
  }


  if (urlSubTopic.length !== 0) {
    addContentToHtml(getContentFromSubTopic(subTopics, urlSubTopic))
  } else {
    addContentToHtml(getMainTopicContentElement(subTopics))
  }
}



function getMainTopics() {
  return audiences.rawData.body.outline.map(function (data) {
    var friendlyName = stringAsText(data._text);
    return {
      'name': friendlyName,
      'url': nameToUrl(friendlyName),
      'content': data.outline
    }
  })
}



function getMainTopicContentElement(array) {
  var contentElements = array.filter(function (subTopic) {
    var topicText = stringAsText(subTopic._text);
    return (topicText === 'Content')
  });

  if (contentElements.length == 1) {
    var content = contentElements[0];
    var contentText = content.outline._text;
    if (contentText[0] === '#' && contentText[contentText.length - 1] === '#') {
      var redirect = nameToUrl(contentText.replace(/#/g, ''));
      return array.filter(function (subtopic) {
        return subtopic.url === redirect
      })[0].outline
    } else {
      return content
    }
  } else {
    return { 'outline': { '_text': 'No Content' } }
  }
}



function getContentFromSubTopic(subTopics, urlSubTopic) {
  var selectedSubTopic = subTopics.filter(function (subTopic) {
    return subTopic.url === urlSubTopic;
  })[0];
  return selectedSubTopic;
}

function removeContentTopic(array) {
  return array.filter(function (topic) {
    return stringAsText(topic._text) !== 'Content'
  })
}



function getSubTopics(mainTopic) {
  var subTopics = getContentForMainTopic(mainTopic);
  if (typeof subTopics.content !== 'undefined') {
    var filteredSubTopics = subTopics.content.map(function (subTopic) {
      var topicText = stringAsText(subTopic._text);
      if (topicText[0] == '[') {
        return expandCSL(topicText, subTopic);
      } else {
        return subTopic;
      }
    });
    var expandedSubTopics = [].concat.apply([], filteredSubTopics);
    return expandedSubTopics.map(function (subTopic) {
      subTopic.name = stringAsText(subTopic._text);
      subTopic.url = nameToUrl(subTopic.name);
      return subTopic;
    })
  } else {
    return { 'name': subTopics._text }
  }
}

function turnCSLintoArray(text) {
  return text.substring(1, text.length - 1).split(',');
}

function expandCSL(text, subTopic) {
  var subTopicArray = turnCSLintoArray(text);
  return subTopicArray.map(function (subTopicText) {
    return {
      '_text': subTopicText.trim(),
      '_note': subTopic._note,
      'outline': subTopic.outline
    };
  })

}



function getContentForMainTopic(mainTopic) {
  return audiences.mainTopics.filter(function (topic) {
    return topic.url == mainTopic;
  })[0];
}



function setUrl(urlTopic) {
  window.history.pushState("unused", "unused", urlTopic);
  $('.placeholder').remove();
  $('.mainNav').remove();
  $('.localNav').remove();

  $('body').append('<div class="mainNav"></div>');
  loadTopics();
}



function addMainTopicsToHtml(mainTopicsArray, urlTopicName) {
  $('.mainNav').append(createUrlString(mainTopicsArray, urlTopicName, ''));
}


function addSubTopicsToHtml(subTopics, urlSubTopic, urlMainTopic) {
  var subTopicString = createUrlString(subTopics, urlSubTopic, '/' + urlMainTopic);
  if ($('.localNav').length == 0) {
    $('.mainNav').after("<div class='localNav'></div>");
  }
  $('.localNav').html(subTopicString);
}

function nameToUrl(name) {
  return name.trim().replace(/[^A-Za-z0-9 ]/g, "").replace(/ /g, '-').toLowerCase();
}

function getMainTopicFromUrl(mainTopics) {
  var path = window.location.pathname.split('/');
  var urlTopic = path[1];
  if (isTopicInArray(urlTopic, mainTopics)) {
    return urlTopic
  } else {
    window.history.pushState("unused", "unused", "/");
    return "";
  }
}

function getSubTopicFromUrl(mainTopics, subTopics) {

  var path = window.location.pathname.split('/');
  var urlTopic = path[1];
  var urlSubTopic = path[2];
  var mainTopic = getMainTopicFromUrl(mainTopics);


  if (isTopicInArray(urlSubTopic, subTopics)) {
    return urlSubTopic
  } else {
    window.history.pushState("unused", "unused", "/" + urlTopic);
    return "";
  }
}

function isTopicInArray(urlTopic, topicArray) {
  return topicArray.some(function (topic) {
    return topic.url == urlTopic
  })
}

function isDefined(variable) {
  return (typeof variable !== 'undefined')
}

function defined(variable, alternate) {
  if (isDefined(variable)) {
    return variable;
  } else {
    return alternate;
  }
}

function addContentToHtml(content) {
  console.log('addContentToHtml ', content);

  var dataElement;
  if (!isDefined(content)) {
    dataElement = "<div class='placeholder'>No Content</div>";
  } else if (!isDefined(content.outline)) {
    var heading = defined(content._text, "");
    var note = defined(content.__note, "");
    dataElement = "<div class='placeholder'>" + heading + "<em>" + note + "</em></div>";
  } else if (!isDefined(content.outline.outline)) {
    dataElement = parseOutline(content.outline);
  } else {
    dataElement = parseOutline(content.outline.outline);
  }


  if ($('.localNav').length > 0) {
    $('.localNav').after(dataElement)
  } else {
    $('.mainNav').after(dataElement)
  }
}


function parseOutline(outline) {

  if (outline.length > 0) {
    return outline.map(function (data) {
      return parseElement(data);
    }).join('');
  } else {
    return parseElement(outline)
  }
}

function stripMarkupAndTrim(data) {
  // should do more robustly
  data = data.replace('<b>', '');
  data = data.replace('</b>', '');
  data = data.replace('<i>', '');
  data = data.replace('</i>', '');
  return data.trim();
}


function parseElement(data) {

  var heading = defined(data._text, "");
  var note = defined(data.__note, "");

  var noteHashes = [];
  var elementClasses = [];

  var noteLines = note.split('\n');

  // split of #tags from actual notes
  noteLines.map(function (elem, i) {
    var el = stripMarkupAndTrim(elem);
    if (el.indexOf('#') === 0) {
      noteHashes.push(el);
      noteLines[i] = '';
    }
  });

  // setup all #tags to be classes
  noteHashes.map(function (elem) {
    var words = elem.split(' ');
    words.map(function (word) {
      if (word.indexOf('#') === 0) {
        elementClasses.push(word.slice(1).toLowerCase());
      }
    });
  });

  return "<div class='placeholder " + elementClasses.join(' ') + "'><h2>" + heading + "</h2>" + "<span class='note note-hashes'>" + noteHashes.join('\n').trim() + "</span><span class='note note-info'>" + noteLines.join('\n').trim() + "</span></div>";
}


$(document).ready(function () {
  loadData();
});

$(document).keyup(function (evt) {

  var body,
      spaceBarKeyCode = 32;

  if (evt.keyCode && evt.keyCode == spaceBarKeyCode && evt.shiftKey) {

    var body = $('body');

    if (body.hasClass('notes')) {
      body.removeClass('notes');
    } else {
      body.addClass('notes');
    }
    return false;
  }

})

