import { Storage } from "@plasmohq/storage";
import { SessionsKeys, type BasicSession, type SessionOpenStatus, type Session, type SessionTabsStore } from "~utils/types";

const getAll = async (): Promise<Session[]> => {
  const localStorage = new Storage({ area: 'local' })
  let basics: BasicSession[] = await localStorage.get(SessionsKeys.basic) || []
  let opens: SessionOpenStatus[] = await localStorage.get(SessionsKeys.open) || []
  let sessionsTabs: SessionTabsStore[] = await localStorage.get(SessionsKeys.tab) || []

  const sessions: Session[] = []

  for (const basicSession of basics) {
    const defaultOpenStatus: SessionOpenStatus = {
      isOpen: false,
      id: basicSession.id,
      windowId: -1,
    }

    const defaultSessionTabs: SessionTabsStore = {
      id: basicSession.id,
      tabs: []
    }
    const openStatus = opens.find(o => o.id === basicSession.id) || defaultOpenStatus
    const tabsStore = sessionsTabs.find(st => st.id === basicSession.id) || defaultSessionTabs
    sessions.push({
      ...basicSession,
      ...openStatus,
      ...tabsStore,
    })
  }

  return sessions
}

export default getAll