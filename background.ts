import actions from "~actions"
import store from "~store"

export { }

chrome.tabGroups.onCreated.addListener(() => {
  actions.session.refreshTabs()
})
chrome.tabGroups.onRemoved.addListener(() => {
  actions.session.refreshTabs()
})
chrome.tabGroups.onMoved.addListener(() => {
  actions.session.refreshTabs()
})
chrome.tabGroups.onUpdated.addListener(() => {
  actions.session.refreshTabs()
})

chrome.tabs.onCreated.addListener(() => {
  actions.session.refreshTabs()
})
chrome.tabs.onUpdated.addListener((id, info) => {
  if (info.url) {
    /* discarding tabs when they have url ensures that their icon and title is loaded before discarding */
    actions.window.discardOpenedTab(id)
  }
  if (info.url || info.groupId) {
    /*
    onUpdated event fires a lot so refreshing tabs after url change or groupId change makes opening sessions quicker as 
    no other information is needed for refreshing tabs
    */
    actions.session.refreshTabs()
  }
})
chrome.tabs.onRemoved.addListener((_, info) => {
  if (!info.isWindowClosing) {
    actions.session.refreshTabs()
  }
})
chrome.tabs.onAttached.addListener(() => {
  actions.session.refreshTabs()
  actions.window.refreshUnsavedWindows()
})
chrome.tabs.onDetached.addListener(() => {
  actions.session.refreshTabs()
  actions.window.refreshUnsavedWindows()
})
chrome.tabs.onMoved.addListener(() => {
  actions.session.refreshTabs()
})
chrome.tabs.onReplaced.addListener(() => {
  actions.session.refreshTabs()
})

chrome.windows.onRemoved.addListener(() => {
  actions.window.refreshUnsavedWindows()
  actions.window.refreshLastClosedWindow()
  actions.session.refreshOpens()
})
chrome.windows.onCreated.addListener((window) => {
  chrome.windows.getAll()
    .then(win => {
      if (win.length === 1) {
        /*
          sometime the browser wont be closed completely so the runtime.onStartup wont run
          when there is only one window (happend on Mac OS) so I just run the openFirstSession here.
        */
        actions.session.openFirst()
          .then(() => {
            actions.window.changeRecentWindowId(window.id)
          })
      } else {
        actions.window.refreshUnsavedWindows()
          .then(() => {
            actions.window.changeRecentWindowId(window.id)
          })
      }
    })
})

chrome.runtime.onStartup.addListener(() => {
  actions.backup.runInterval()
})


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'alert-ready' && sender.tab) {
    store.unsavedWindows.getAlertId()
      .then(res => {
        if (!res.alertShown) {
          actions.window.includesTab(res.windowId, sender.tab.id)
            .then(include => {
              if (include) {
                sendResponse({ action: 'alert-go' })
              }
            })
        }
      })
  } else if (message.action === 'save-session') {
    if (message.windowId && message.windowId > 0) {
      actions.session.create({ windowId: message.windowId })
      sendResponse({ message: 'saved' })
    } else {
      sendResponse({ message: 'not-saved' })
    }
  }
})