import { localStore } from "~utils/storageManager";
import { SessionsKeys, type BasicSession, type SessionOpenStatus, type Session, type SessionTabsStore } from "~utils/types";

const getAll = async (): Promise<Session[]> => {
  const localStorage = localStore
  const [basics = [], opens = [], sessionsTabs = []] = await Promise.all([
    localStorage.get<BasicSession[]>(SessionsKeys.basic).then(res => res || []),
    localStorage.get<SessionOpenStatus[]>(SessionsKeys.open).then(res => res || []),
    localStorage.get<SessionTabsStore[]>(SessionsKeys.tab).then(res => res || [])
  ])

  const opensMap = new Map<string, SessionOpenStatus>(opens.map(o => [o.sessionId, o]))
  const tabsMap = new Map<string, SessionTabsStore>(sessionsTabs.map(st => [st.sessionId, st]))

  const sessions: Session[] = []

  for (const basicSession of basics) {
    const defaultOpenStatus: SessionOpenStatus = {
      isOpen: false,
      sessionId: basicSession.id,
      windowId: -1,
      freeze: false
    }

    const defaultSessionTabs: SessionTabsStore = {
      sessionId: basicSession.id,
      tabs: []
    }
    const openStatus = opensMap.get(basicSession.id) || defaultOpenStatus
    const tabsStore = tabsMap.get(basicSession.id) || defaultSessionTabs
    sessions.push({
      ...basicSession,
      ...openStatus,
      ...tabsStore,
    })
  }

  return sessions
}

export default getAll