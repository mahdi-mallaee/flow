import { Storage } from "@plasmohq/storage";
import { SessionsKeys, type BasicSession, type SessionOpenStatus, type Session, type SessionTabsStore } from "~utils/types";

const getAllSessions = async (): Promise<Session[]> => {
  const store = new Storage({ area: 'local' })
  let basics: BasicSession[] = await store.get(SessionsKeys.basic) || []
  let opens: SessionOpenStatus[] = await store.get(SessionsKeys.open) || []
  let sessionsTabs: SessionTabsStore[] = await store.get(SessionsKeys.tab) || []

  const sessions: Session[] = []

  for (const basicSession of basics) {

    let isOpen = false
    let windowId = -1
    const isOpenStore = opens.find(o => o.sessionId === basicSession.id)
    if (isOpenStore && typeof isOpenStore.isOpen === 'boolean' && isOpenStore.windowId >= -1) {
      isOpen = isOpenStore.isOpen
      windowId = isOpenStore.windowId
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