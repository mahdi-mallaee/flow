import actions from "~actions"
import initMsgControl from "~actions/background/messageControl"
import { NEW_TAB_URL } from "~utils/constants"
import type { BgGlobalVar } from "~utils/types"

export { }

let gl: BgGlobalVar = {
  refreshUnsavedWindows: true
}

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
  actions.session.refreshTabs(gl)
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
chrome.tabs.onUpdated.addListener((id, info) => {
  if (info.url && info.url !== NEW_TAB_URL) {
    /* discarding tabs when they have url ensures that their icon and title is loaded before discarding */
    actions.window.discardOpenedTab(id)
  }
  if (info.url || info.groupId || info.pinned !== undefined) {
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

initMsgControl(gl)