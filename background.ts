import refreshTabs from "~actions/refreshTabs"
import refreshUnsavedWindows from "~actions/refreshUnsavedWindows"
import openFirstSession from "~actions/openFirstSession"
import refreshLastClosedWindow from "~actions/refreshLastClosedWindow"
import discardOpenedTab from "~actions/discardOpenedTab"
import refreshOpenSessions from "~actions/refreshOpenSessions"
import runIntervalBakcups from "~actions/runIntervalBackups"

export { }

chrome.tabs.onCreated.addListener(() => {
  refreshTabs()
})
chrome.tabs.onUpdated.addListener((id, info) => {
  if (info.url) {
    refreshTabs()
    discardOpenedTab(id)
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
  refreshUnsavedWindows()
})

chrome.runtime.onStartup.addListener(() => {
  openFirstSession()
  runIntervalBakcups()
})