import refreshTabs from "~storage/refreshTabs"
import refreshUnsavedWindows from "~storage/refreshUnsavedWindows"
import openMainSession from "~storage/openMainSession"
import refreshLastClosedWindow from "~storage/refreshLastClosedWindow"

export { }

chrome.tabs.onCreated.addListener(() => {
    refreshTabs()
})
chrome.tabs.onUpdated.addListener(() => {
    refreshTabs()
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
})

chrome.windows.onCreated.addListener(() => {
    refreshUnsavedWindows()
})

chrome.runtime.onStartup.addListener(() => {
    openMainSession()
})