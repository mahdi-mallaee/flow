import refreshTabs from "~actions/refreshTabs"
import refreshUnsavedWindows from "~actions/refreshUnsavedWindows"
import openMainSession from "~actions/openMainSession"
import refreshLastClosedWindow from "~actions/refreshLastClosedWindow"
import discardOpenedTab from "~actions/discardOpenedTab"
import refreshOpenSessions from "~actions/refreshOpenSessions"

export { }

chrome.tabs.onCreated.addListener(() => {
  refreshTabs()
})
chrome.tabs.onUpdated.addListener((id, info) => {
  refreshTabs()
  if (info.url) {
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
  openMainSession()
})