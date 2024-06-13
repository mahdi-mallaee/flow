import actions from "~actions"
import store from "~store"
import { NEW_TAB_URL } from "~utils/constants"
import { Message } from "~utils/types"

export { }

let refreshUnsvavedWindows = true
chrome.runtime.onStartup.addListener(() => {
  refreshUnsvavedWindows = false
  actions.session.openFirstSession()
    .then(() => {
      refreshUnsvavedWindows = true
    })
  actions.backup.runInterval()
})

chrome.tabGroups.onCreated.addListener(() => {
  actions.session.refreshTabs()
  actions.session.refreshGroups()
})
chrome.tabGroups.onRemoved.addListener(() => {
  actions.session.refreshTabs()
})
chrome.tabGroups.onMoved.addListener(() => {
  actions.session.refreshTabs()
  actions.session.refreshGroups()
})
chrome.tabGroups.onUpdated.addListener(() => {
  actions.session.refreshTabs()
  actions.session.refreshGroups()
})

chrome.tabs.onCreated.addListener(() => {
  actions.session.refreshTabs()
})
chrome.tabs.onUpdated.addListener((id, info) => {
  if (info.url && info.url !== NEW_TAB_URL) {
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
  actions.session.refreshOpenSessions()
})
chrome.windows.onCreated.addListener((window) => {
  chrome.windows.getAll()
    .then(win => {
      if (win.length === 1) {
        /*
          sometime the browser wont be closed completely so the runtime.onStartup wont run
          when there is only one window (happend on Mac OS) so I just run the openFirstSession here.
        */
        actions.session.openFirstSession()
          .then(() => {
            if (refreshUnsvavedWindows) {
              actions.window.changeRecentWindowId(window.id)
            }
          })
      } else {
        if (refreshUnsvavedWindows) {
          actions.window.refreshUnsavedWindows()
            .then(() => {
              actions.window.changeRecentWindowId(window.id)
            })
        }
      }
    })
})

chrome.runtime.onStartup.addListener(() => {
  actions.backup.runInterval()
})

chrome.runtime.onMessage.addListener((
  { message, payload }:
    { message: Message, payload: any }, sender, sendResponse) => {
  if (message === Message.alertReady && sender.tab) {
    store.windows.getUnsavedWindowAlertStatus()
      .then(res => {
        if (!res.alertShown) {
          actions.window.includesTab(res.windowId, sender.tab.id)
            .then(include => {
              if (include) {
                sendResponse({ message: Message.alertGo })
              }
            })
        }
      })
  } else if (message === Message.saveSession) {
    if (actions.window.checkId(sender.tab.windowId)) {
      actions.session.checkNumberLimit()
        .then(res => {
          if (res) {
            actions.session.create({ windowId: sender.tab.windowId })
              .then(result => {
                if (result) {
                  sendResponse({ message: Message.success })
                } else {
                  sendResponse({ message: Message.error })
                }
              })
          } else {
            sendResponse({ message: Message.error })
          }
        })
    } else {
      sendResponse({ message: Message.error })
    }
  } else if (message === Message.openSession) {
    refreshUnsvavedWindows = false
    actions.session.open(payload.sessionId, payload.alterSettingsBehavior, payload.windowId)
      .finally(() => { refreshUnsvavedWindows = true })
  } else if (message === Message.createSession) {
    refreshUnsvavedWindows = false
    actions.session.create(payload)
      .then(result => {
        sendResponse(result)
      }).finally(() => { refreshUnsvavedWindows = true })
  }

  return true
})