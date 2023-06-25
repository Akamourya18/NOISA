const strings = {
  contentScript: 'index.js',
  setIconRequest: 'setIcon',
  clickIconRequest: 'iconClick',
  localStorageItem: 'allowAnimation',
  animateIcon: 'icons/resume32.png',
  freezeIcon: 'icons/pause32.png',
}; // Path: background.js

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request[strings.setIconRequest]) {
    if (request[strings.setIconRequest] === 'true') {
      chrome.browserAction.setIcon({
        tabId: sender.tab.id,
        path: strings.animateIcon,
      }); // To set the animateIcon on specified tab
      function insertCode(tabId, isDark) {
        chrome.tabs.insertCSS(tabId, {
          code: isDark
            ? 'img, video, embed {  -webkit-filter: contrast(30%); } '
            : 'img, video, embed {  -webkit-filter: none; } ',
          allFrames: true,
          runAt: 'document_start',
        });
      } // Function to insert css code

      chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
          var tab = tabs[i];
          if (tab.url && tab.url.slice(0, 4) == 'http')
            insertCode(tab.id, false);
        } // Looping through all tabs and inserting css code
      });
    } else {
      chrome.browserAction.setIcon({
        tabId: sender.tab.id,
        path: strings.freezeIcon,
      }); // To set the freezeIcon on specified tab
      function insertCode(tabId, isDark) {
        chrome.tabs.insertCSS(tabId, {
          code: isDark
            ? 'img, video, embed {  -webkit-filter: contrast(70%); } '
            : 'img, video, embed {  -webkit-filter: none; } ',
          allFrames: true,
          runAt: 'document_start',
        }); // Function to insert css code
      }

      chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
          var tab = tabs[i];
          if (tab.url && tab.url.slice(0, 4) == 'http')
            insertCode(tab.id, true);
        }
      }); // Looping through all tabs and inserting css code
    }
  }
});

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { [strings.clickIconRequest]: true });

  chrome.tabs.executeScript(tab.id, {
    code: `
      if (localStorage.getItem('${strings.localStorageItem}') == null) {
          localStorage.setItem('${strings.localStorageItem}', false);
      } else {
        localStorage.setItem('${strings.localStorageItem}', localStorage.getItem('${strings.localStorageItem}') === 'true' ? false : true);
      }
    `,
  }); // To toggle the localStorageItem
  chrome.tabs.executeScript(tab.id, { file: strings.contentScript });
}); // Event Listener for click on icon
