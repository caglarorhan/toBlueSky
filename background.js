chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({redirectEnabled: true});
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleRedirect") {
      if (request.enabled) {
        chrome.declarativeNetRequest.updateEnabledRulesets({enableRulesetIds: ["ruleset_1"]});
      } else {
        chrome.declarativeNetRequest.updateEnabledRulesets({disableRulesetIds: ["ruleset_1"]});
      }
    }
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.storage.sync.get('redirectEnabled', (data) => {
        if (data.redirectEnabled && (tab.url.includes('twitter.com') || tab.url.includes('x.com'))) {
          chrome.tabs.update(tabId, {url: 'https://bsky.app'});
        }
      });
    }
  });