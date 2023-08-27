import { Storage } from "@plasmohq/storage";
import { SessionsKeys, type BasicSession, type OpenSessionStore, type Session, type WindowIdStore, type SessionTabsStore } from "~utils/types";

const getAllSessions = async (): Promise<Session[]> => {
  const store = new Storage({ area: 'local' })
  let basics: BasicSession[] = await store.get(SessionsKeys.basic) || []
  let windowIds: WindowIdStore[] = await store.get(SessionsKeys.windowId) || []
  let opens: OpenSessionStore[] = await store.get(SessionsKeys.open) || []
  let sessionsTabs: SessionTabsStore[] = await store.get(SessionsKeys.tab) || []

  const sessions: Session[] = []

  for (const basicSession of basics) {
    const windowIdStore = windowIds.find(w => w.sessionId === basicSession.id)
    let windowId = -1
    if (windowIdStore && windowIdStore.windowId && windowIdStore.windowId > 0) {
      windowId = windowIdStore.windowId
    }

    let isOpen = false
    const isOpenStore = opens.find(o => o.sessionId === basicSession.id)
    if (isOpenStore && typeof isOpenStore.isOpen === 'boolean') {
      isOpen = isOpenStore.isOpen
    }

    let tabs = []
    const tabsStore = sessionsTabs.find(st => st.sessionId === basicSession.id)
    if (tabsStore && tabsStore.tabs && tabsStore.tabs.length > 0) {
      tabs = tabsStore.tabs
    }

    sessions.push({
      ...basicSession,
      windowId,
      tabs,
      isOpen
    })
  }

  return sessions
}

export default getAllSessions