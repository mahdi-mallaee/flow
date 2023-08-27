import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession, type OpenSessionStore, type Session, type SessionTabsStore, type WindowIdStore } from "~utils/types"
import refreshSessionsStatus from "./refreshSessionsStatus"

const setAllSessions = async (sessions: Session[]) => {

  if (!sessions) {
    return
  }

  const store = new Storage({ area: 'local' })

  const basicSessions: BasicSession[] = sessions.map(s => {
    return {
      id: s.id,
      colorCode: s.colorCode,
      main: s.main,
      title: s.title
    }
  })

  const sessionsTabs: SessionTabsStore[] = sessions.map(s => {
    return {
      sessionId: s.id,
      tabs: s.tabs
    }
  })

  const openSessions: OpenSessionStore[] = sessions.map(s => {
    return {
      sessionId: s.id,
      isOpen: s.isOpen
    }
  })

  const windowIds: WindowIdStore[] = sessions.map(s => {
    return {
      sessionId: s.id,
      windowId: s.windowId
    }
  })

  await store.set(SessionsKeys.basic, basicSessions)
  await store.set(SessionsKeys.open, openSessions)
  await store.set(SessionsKeys.tab, sessionsTabs)
  await store.set(SessionsKeys.windowId, windowIds)
  await refreshSessionsStatus()
}
export default setAllSessions