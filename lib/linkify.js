var regex_text = "# Pirated from http:\/\/daringfireball.net\/2010\/07\/improved_regex_for_matching_urls\r\n# FIXME the first line from there doesn\'t work in JS, can it be omitted? just doing it for now\r\n\\b\r\n(                           # Capture 1: entire matched URL\r\n  (?:\r\n    [a-z][\\w-]+:                # URL protocol and colon\r\n    (?:\r\n      \/{1,3}                        # 1-3 slashes\r\n      |                             #   or\r\n      [a-z0-9%]                     # Single letter or digit or \'%\'\r\n                                    # (Trying not to match e.g. \"URI::Escape\")\r\n    )\r\n    |                           #   or\r\n    www\\d{0,3}[.]               # \"www.\", \"www1.\", \"www2.\" \u2026 \"www999.\"\r\n    |                           #   or\r\n    [a-z0-9.\\-]+[.][a-z]{2,4}\/  # looks like domain name followed by a slash\r\n  )\r\n  (?:                           # One or more:\r\n    [^\\s()<>]+                      # Run of non-space, non-()<>\r\n    |                               #   or\r\n    \\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\)  # balanced parens, up to 2 levels\r\n  )+\r\n  (?:                           # End with:\r\n    \\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\)  # balanced parens, up to 2 levels\r\n    |                                   #   or\r\n    [^\\s`!()\\[\\]{};:\'\".,<>?\u00AB\u00BB\u201C\u201D\u2018\u2019]        # not a space or one of these punct chars\r\n  )\r\n)";

var MAGIC_REGEX = (function() {
  return new RegExp(regex_text
                    .split('\r\n')
                    .map(function(line) {
                      return line.split('#')[0].trim()
                    })
                    .join('')
                   ,
                    'gi'
                   )
})()

function replaceURLs(text, fn) {
  if (typeof fn === 'string') {
    if (fn === 'html')
      fn = function(match, url) {
        url = url.replace(/"/g, '&quot;')
        return '<a href="'+url+'">'+match+'</a>'
      }
    else if (fn === 'latex')
      fn = function(match, url) {
        url = url.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
        return '\\href{'+url+'}{'+match+'}'
      }
    else
      throw new Error('unknown replacer type')
  }
  return text.replace(MAGIC_REGEX, function(match) {
    var matchURL = match
    if (!/^[a-zA-Z]{1,6}:/.test(matchURL)) matchURL = 'http://' + matchURL
    return fn(match, matchURL)
  })
}

module.exports = replaceURLs
