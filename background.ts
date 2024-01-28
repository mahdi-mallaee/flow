import refreshTabs from "~actions/refreshTabs"
import refreshUnsavedWindows from "~actions/refreshUnsavedWindows"
import openFirstSession from "~actions/openFirstSession"
import refreshLastClosedWindow from "~actions/refreshLastClosedWindow"
import discardOpenedTab from "~actions/discardOpenedTab"
import refreshOpenSessions from "~actions/refreshOpenSessions"
import runIntervalBakcups from "~actions/runIntervalBackups"
import Store from "~store"
import doesWindowIncludesTab from "~actions/doesWindowIncludesTab"
import isWindowUnsaved from "~actions/isWindowUnsaved"

export { }

chrome.tabGroups.onCreated.addListener(() => {
  refreshTabs()
})
chrome.tabGroups.onRemoved.addListener(() => {
  refreshTabs()
})
chrome.tabGroups.onMoved.addListener(() => {
  refreshTabs()
})
chrome.tabGroups.onUpdated.addListener(() => {
  refreshTabs()
})

chrome.tabs.onCreated.addListener(() => {
  refreshTabs()
})
chrome.tabs.onUpdated.addListener((id, info) => {
  if (info.url) {
    /* discarding tabs when they have url ensures that their icon and title is loaded before discarding */
    discardOpenedTab(id)
  }
  if (info.url || info.groupId) {
    /*
    onUpdated event fires a lot so refreshing tabs after url change or groupId change makes opening sessions quicker as 
    no other information is needed for refreshing tabs
    */
    refreshTabs()
  }
})
chrome.tabs.onRemoved.addListener((_, info) => {
  if (!info.isWindowClosing) {
    refreshTabs()
  }
})
chrome.tabs.onAttached.addListener(() => {
  refreshTabs()
  refreshUnsavedWindows()
})
chrome.tabs.onDetached.addListener(() => {
  refreshTabs()
  refreshUnsavedWindows()
})
chrome.tabs.onMoved.addListener(() => {
  refreshTabs()
})
chrome.tabs.onReplaced.addListener(() => {
  refreshTabs()
})

chrome.windows.onRemoved.addListener(() => {
  refreshUnsavedWindows()
  refreshLastClosedWindow()
  refreshOpenSessions()
})
chrome.windows.onCreated.addListener((window) => {
  chrome.windows.getAll()
    .then(win => {
      if (win.length === 1) {
        /*
          sometime the browser wont be closed completely so the runtime.onStartup wont run
          when there is only one window (happend on Mac OS) so I just run the openFirstSession here.
        */
        openFirstSession()
          .then(() => {
            isWindowUnsaved(window.id)
              .then(res => {
                if (res) {
                  Store.unsavedWindows.changeAlertId(window.id, false)
                }
              })
          })
      } else {
        refreshUnsavedWindows()
          .then(() => {
            isWindowUnsaved(window.id)
              .then(res => {
                if (res) {
                  Store.unsavedWindows.changeAlertId(window.id, false)
                }
              })
          })
      }
    })
})

chrome.runtime.onStartup.addListener(() => {
  runIntervalBakcups()
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'alert-ready' && sender.tab) {
    Store.unsavedWindows.getAlertId()
      .then(res => {
        if (!res.alertShown) {
          doesWindowIncludesTab(res.windowId, sender.tab.id)
            .then(include => {
              if (include) {
                sendResponse({ action: 'alert-go' })
              }
            })
        }
      })
  }
})