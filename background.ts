import saveClosingTabs from "~actions/saveClosingTabs"
import type { Tab } from "~utils/types"
import { Storage as store } from '@plasmohq/storage'
import getUnsavedWindows from "~actions/getUnsavedWindows"

export { }

const storage = new store({ area: 'local' })

let localTabs: Tab[] = []

const refreshTabs = async () => {
    chrome.tabs.query({})
        .then(browserTabs => {
            localTabs = browserTabs.map(tab => {
                return {
                    id: tab.id,
                    url: tab.pendingUrl || tab.url || '',
                    windowId: tab.windowId,
                    index: tab.index,
                    groupId: tab.groupId
                }
            })
            storage.set('tabs', localTabs)
        })
}

const refreshUnsavedWindows = async () => {
    storage.get('sessions')
        .then((sessions: any) => {
            getUnsavedWindows(sessions)
                .then(windows => {
                    storage.set('unsaved-windows', windows)
                })
        })
}

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
})
chrome.tabs.onDetached.addListener(() => {
    refreshTabs()
})
chrome.tabs.onMoved.addListener(() => {
    refreshTabs()
})
chrome.tabs.onReplaced.addListener(() => {
    refreshTabs()
})

chrome.windows.onRemoved.addListener(id => {
    refreshUnsavedWindows()
    const closingTabs = []
    storage.get('tabs')
        .then((tabs: any) => {
            tabs.forEach((tab: Tab) => {
                if (tab.windowId === id) {
                    closingTabs.push(tab)
                }
            })
            storage.get('sessions')
                .then((sessions: any) => {
                    const newSessions = saveClosingTabs(sessions, closingTabs, id)
                    storage.set('sessions', newSessions)
                })
        })
})

chrome.windows.onCreated.addListener(() => {
    refreshUnsavedWindows()
})