import actions from "~actions"
import messageControl from "~actions/background/messageControl"
import store from "~store"
import { LANDING_PAGE_URL, NEW_TAB_URL } from "~utils/constants"
import type { BgGlobalVar } from "~utils/types"
import { Message } from '~utils/types'

export { }

let gl: BgGlobalVar = {
  refreshUnsavedWindows: true,
  closingWindow: {
    status: false,
    windowId: -1
  }
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: LANDING_PAGE_URL });
  }
})

chrome.runtime.onStartup.addListener(() => {
  gl.refreshUnsavedWindows = false
  actions.session.openFirstSession()
    .then(() => {
      gl.refreshUnsavedWindows = true
    })
  actions.backup.runInterval()
})

chrome.tabGroups.onCreated.addListener(() => {
  actions.session.refreshTabs(gl)
  actions.session.refreshGroups()
})
chrome.tabGroups.onRemoved.addListener(() => {
  if (!gl.closingWindow) {
    actions.session.refreshTabs(gl)
  }
})
chrome.tabGroups.onMoved.addListener(() => {
  actions.session.refreshTabs(gl)
  actions.session.refreshGroups()
})
chrome.tabGroups.onUpdated.addListener(() => {
  actions.session.refreshTabs(gl)
  actions.session.refreshGroups()
})

chrome.tabs.onCreated.addListener(() => {
  actions.session.refreshTabs(gl)
})
chrome.tabs.onUpdated.addListener((id, info, tab) => {
  if ((info.url && info.url !== NEW_TAB_URL) || (info.title && info.title !== "")) {
    /* discarding tabs when they have url ensures that their icon and title is loaded before discarding */
    store.settings.getAll()
      .then(settings => {
        if (settings.discardTabsAfterTitleLoad) {
          if (info.title && !tab.active) {
            actions.window.discardOpenedTab(id)
          }
        } else if (info.url && info.url !== NEW_TAB_URL) {
          actions.window.discardOpenedTab(id)
        }
      })
  }
  if ((info.url || info.groupId || info.pinned !== undefined) && gl.closingWindow.windowId !== tab.windowId) {
    /*
    onUpdated event fires a lot so refreshing tabs after url change or groupId change makes opening sessions quicker as 
    no other information is needed for refreshing tabs
    */
    actions.session.refreshTabs(gl)
  }
})
chrome.tabs.onRemoved.addListener((_, info) => {
  if (!info.isWindowClosing) {
    actions.session.refreshTabs(gl)
  } else {
    gl.closingWindow.status = true
    gl.closingWindow.windowId = info.windowId
  }
})
chrome.tabs.onAttached.addListener(() => {
  actions.session.refreshTabs(gl)
  actions.window.refreshUnsavedWindows()
})
chrome.tabs.onDetached.addListener(() => {
  actions.session.refreshTabs(gl)
  actions.window.refreshUnsavedWindows()
})
chrome.tabs.onMoved.addListener(() => {
  actions.session.refreshTabs(gl)
})
chrome.tabs.onReplaced.addListener(() => {
  actions.session.refreshTabs(gl)
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
            if (gl.refreshUnsavedWindows) {
              actions.window.changeRecentWindowId(window.id)
            }
          })
      } else {
        if (gl.refreshUnsavedWindows) {
          actions.window.refreshUnsavedWindows()
            .then(() => {
              actions.window.changeRecentWindowId(window.id)
            })
        }
      }
    })
})

chrome.runtime.onMessage.addListener((
  { message, payload }:
    { message: Message, payload: any }, sender, sendResponse) => {

  messageControl(gl, sender, message, payload, sendResponse)

  return true
})