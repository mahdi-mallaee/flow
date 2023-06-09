import saveClosingTabs from "~actions/saveClosingTabs"
import type { Tab } from "~utils/types"
import { Storage as store } from '@plasmohq/storage'

export { }

console.log('running background script')

const storage = new store({ area: 'local' })

const tabs: Tab[] = []

const getTabById = (id: number): Tab => {
    const index = tabs.findIndex(tab => tab.id === id)
    return tabs[index]
}

chrome.tabs.onCreated.addListener(tab => {
    tabs.push({ id: tab.id, url: tab.pendingUrl || tab.url || '', windowId: tab.windowId, index: tab.index, groupId: tab.groupId })
})

chrome.tabs.onUpdated.addListener((id, info) => {
    const tab = getTabById(id)
    if (tab) {
        if (info.groupId) {
            tab.groupId = info.groupId
        }
        if (info.url) {
            tab.url = info.url
        }
    }

})
chrome.tabs.onRemoved.addListener((id, info) => {
    if (!info.isWindowClosing) {
        const index = tabs.findIndex(tab => tab.id === id)
        tabs.splice(index, 1)
    }
})

chrome.windows.onRemoved.addListener(id => {
    const closingTabs = []
    tabs.forEach(tab => {
        if (tab.windowId === id) {
            closingTabs.push(tab)
        }
    })
    storage.get('sessions')
        .then((sessions: any) => {
            const newSessions = saveClosingTabs(sessions, closingTabs)
            storage.set('sessions', newSessions)
        })
})
