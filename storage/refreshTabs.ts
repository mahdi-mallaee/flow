import type { Session, Tab } from "~utils/types"
import { Storage } from '@plasmohq/storage'

const refreshTabs = async () => {
    const storage = new Storage({ area: 'local' })

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
                    if (sessions) {
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
                        storage.set('sessions', newSessions)
                    }
                })
        })
}

export default refreshTabs