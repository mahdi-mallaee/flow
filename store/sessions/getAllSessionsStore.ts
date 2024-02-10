import { Storage } from "@plasmohq/storage";
import { WINDOWID_NONE } from "~utils/constants";
import { SessionsKeys, type BasicSession, type SessionOpenStatus, type Session, type SessionTabsStore } from "~utils/types";

const getAllSessionsStore = async (): Promise<Session[]> => {
  const localStorage = new Storage({ area: 'local' })
  let basics: BasicSession[] = await localStorage.get(SessionsKeys.basic) || []
  let opens: SessionOpenStatus[] = await localStorage.get(SessionsKeys.open) || []
  let sessionsTabs: SessionTabsStore[] = await localStorage.get(SessionsKeys.tab) || []

  const sessions: Session[] = []

  for (const basicSession of basics) {
    let isOpen = false
    let windowId = WINDOWID_NONE
    const isOpenStore = opens.find(o => o.sessionId === basicSession.id)
    if (isOpenStore && typeof isOpenStore.isOpen === 'boolean' && isOpenStore.windowId > 0) {
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

export default getAllSessionsStore