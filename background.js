requirejs.config(requirejsConfig);

requirejs(
    { baseUrl: chrome.extension.getURL("/") },
    ["src/startContentProcessor"],
    function (Processor) {
      chrome.pageAction.onClicked.addListener(function(tab) {
        Processor();
      });

      // When the extension is installed or upgraded ...
      chrome.runtime.onInstalled.addListener(function() {
        // Replace all rules ...
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
          // With a new rule ...
          chrome.declarativeContent.onPageChanged.addRules([
            {
              // That fires when a page's URL contains a 'g' ...
              conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                  pageUrl: { hostEquals: 'workflowy.com', schemes: ['https', 'http'] },
                })
              ],
              // And shows the extension's page action.
              actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }
          ]);
        });
      });
    }
);