import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession, type SessionOpenStatus, type Session, type SessionTabsStore } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"
import actions from "~actions"

const setAll = async (sessions: Session[]): Promise<boolean> => {
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
      isOpen: s.isOpen,
      windowId: s.windowId,
      freeze: s.freeze,
      sessionId: s.id
    }
  })

  try {
    await localStorage.set(SessionsKeys.basic, basicSessions)
    await localStorage.set(SessionsKeys.open, sessionsOpenStatus)
    await localStorage.set(SessionsKeys.tab, sessionsTabs)
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR: could not set the sessions correctly -> store/sessions/setAll l.12')
      console.log('a backup will be created')
    }
    await actions.backup.create({ status: "manual", title: 'incorrect session set backup', sessions })
    return false
  }
  await refreshSessionStatus()
  return true
}
export default setAll