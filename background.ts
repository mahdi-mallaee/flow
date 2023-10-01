import refreshTabs from "~actions/refreshTabs"
import refreshUnsavedWindows from "~actions/refreshUnsavedWindows"
import openFirstSession from "~actions/openFirstSession"
import refreshLastClosedWindow from "~actions/refreshLastClosedWindow"
import discardOpenedTab from "~actions/discardOpenedTab"
import refreshOpenSessions from "~actions/refreshOpenSessions"
import runIntervalBakcups from "~actions/runIntervalBackups"

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
    /*
    discarding tabs when they have url ensures that their icon and title is loaded before discarding
    */
    discardOpenedTab(id)
  }
  if (info.url || info.groupId) {
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

chrome.windows.onCreated.addListener(() => {
  chrome.windows.getAll()
    .then(win => {
      if (win.length === 1) {
        /*
          sometime the browser wont be closed completely so the runtime.onStartup wont run
          when there is only one window (happend on Mac OS) so I just run the openFirstSession here.
        */
        openFirstSession()
      } else {
        refreshUnsavedWindows()
      }
    })
})

chrome.runtime.onStartup.addListener(() => {
  runIntervalBakcups()
})