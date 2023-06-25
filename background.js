const strings = {
  contentScript: 'index.js',
  setIconRequest: 'setIcon',
  clickIconRequest: 'iconClick',
  localStorageItem: 'allowAnimation',
  resumeIcon: 'icons/resume32.png',
  pauseIcon: 'icons/pause32.png',
};

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request[strings.setIconRequest]) {
    if (request[strings.setIconRequest] === 'true') {
      chrome.browserAction.setIcon({
        tabId: sender.tab.id,
        path: strings.resumeIcon,
      });
      function insertCode(tabId, isDark) {
        chrome.tabs.insertCSS(tabId, {
          code: isDark
            ? 'video, embed {  -webkit-filter: invert(100%) hue-rotate(180deg); } '
            : 'video, embed {  -webkit-filter: none; } ',
          allFrames: true,
          runAt: 'document_start',
        });
      }

      chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
          var tab = tabs[i];
          if (tab.url && tab.url.slice(0, 4) == 'http')
            insertCode(tab.id, false);
        }
      });
    } else {
      chrome.browserAction.setIcon({
        tabId: sender.tab.id,
        path: strings.pauseIcon,
      });
      function insertCode(tabId, isDark) {
        chrome.tabs.insertCSS(tabId, {
          code: isDark
            ? 'video, embed {  -webkit-filter: invert(100%) hue-rotate(180deg); } '
            : 'video, embed {  -webkit-filter: none; } ',
          allFrames: true,
          runAt: 'document_start',
        });
      }

      chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
          var tab = tabs[i];
          if (tab.url && tab.url.slice(0, 4) == 'http')
            insertCode(tab.id, true);
        }
      });
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
  });
  chrome.tabs.executeScript(tab.id, { file: strings.contentScript });
});

function insertCode(tabId, isDark) {
  chrome.tabs.insertCSS(tabId, {
    code: isDark
      ? 'video, embed {  -webkit-filter: invert(100%) hue-rotate(180deg); } '
      : 'video, embed {  -webkit-filter: none; } ',
    allFrames: true,
    runAt: 'document_start',
  });
}

chrome.tabs.query({}, function (tabs) {
  for (var i = 0; i < tabs.length; ++i) {
    var tab = tabs[i];
    if (tab.url && tab.url.slice(0, 4) == 'http') insertCode(tab.id, true);
  }
});
