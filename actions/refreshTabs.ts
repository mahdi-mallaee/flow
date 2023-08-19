import { StoreKeys, type Session, type Tab } from "~utils/types"
import { Storage } from '@plasmohq/storage'

const refreshTabs = async () => {
  const store = new Storage({ area: 'local' })

  const browserTabs = await chrome.tabs.query({})
  const localTabs: Tab[] = browserTabs.map(tab => {
    return {
      id: tab.id,
      url: tab.pendingUrl || tab.url || 'chrome://newtab',
      windowId: tab.windowId,
      index: tab.index,
      groupId: tab.groupId
    }
  })

  const sessions: Session[] = await store.get(StoreKeys.sessions)
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
    await store.set(StoreKeys.sessions, newSessions)
  }
}

export default refreshTabs