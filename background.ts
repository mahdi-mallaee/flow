import type { Session, Tab } from "~utils/types"
import { Storage as store } from '@plasmohq/storage'
import getUnsavedWindows from "~actions/getUnsavedWindows"

export { }

const storage = new store({ area: 'local' })

const refreshTabs = async () => {
    chrome.tabs.query({})
        .then(browserTabs => {
            const localTabs: Tab[] = browserTabs.map(tab => {
                return {
                    id: tab.id,
                    url: tab.pendingUrl || tab.url || '',
                    windowId: tab.windowId,
                    index: tab.index,
                    groupId: tab.groupId
                }
            })

            storage.get('sessions')
                .then((sessions: any) => {
                    if (sessions){
                    const newSessions = sessions.map((session: Session) => {
                        const sessionTabs = []
                        localTabs.forEach(tab => {
                            if (tab.windowId === session.windowId) {
                                sessionTabs.push(tab)
                            }
                        })
                        if (sessionTabs && sessionTabs.length > 0) {
                            session.tabs = sessionTabs
                        }
                        return session
                    })
                    storage.set('sessions', newSessions)}
                })
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
})

chrome.windows.onCreated.addListener(() => {
    refreshUnsavedWindows()
})