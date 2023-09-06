import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession, type SessionOpenStatus, type Session, type SessionTabsStore } from "~utils/types"
import refreshSessionsStatusStore from "./refreshSessionsStatusStore"

const setAllSessionsStore = async (sessions: Session[]) => {
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

  const sessionsOpenStatus: SessionOpenStatus[] = sessions.map(s => {
    return {
      sessionId: s.id,
      isOpen: s.isOpen,
      windowId: s.windowId
    }
  })

  await store.set(SessionsKeys.basic, basicSessions)
  await store.set(SessionsKeys.open, sessionsOpenStatus)
  await store.set(SessionsKeys.tab, sessionsTabs)
  await refreshSessionsStatusStore()
}
export default setAllSessionsStore