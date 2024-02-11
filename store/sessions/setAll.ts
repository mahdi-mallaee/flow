import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession, type SessionOpenStatus, type Session, type SessionTabsStore } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"

const setAll = async (sessions: Session[]) => {
  if (!sessions) {
    return
  }

  const localStorage = new Storage({ area: 'local' })

  const basicSessions: BasicSession[] = sessions.map(s => {
    return {
      id: s.id,
      colorCode: s.colorCode,
      main: s.main,
      title: s.title,
      groups: s.groups
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

  await localStorage.set(SessionsKeys.basic, basicSessions)
  await localStorage.set(SessionsKeys.open, sessionsOpenStatus)
  await localStorage.set(SessionsKeys.tab, sessionsTabs)
  await refreshSessionStatus()
}
export default setAll