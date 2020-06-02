chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "monetizationPending") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let activeTab = tabs[0];
      images = {
        16: "icons/monetization_active-16.png",
        32: "icons/monetization_active-32.png",
      }
      chrome.browserAction.setIcon({path: images, tabId: activeTab.id});
    });
  }
});
