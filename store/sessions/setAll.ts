import { localStore } from "~utils/storageManager"
import { SessionsKeys, type BasicSession, type SessionOpenStatus, type Session, type SessionTabsStore } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"
import logger from "~utils/logger"

const setAll = async (sessions: Session[]): Promise<boolean> => {
  if (!sessions) {
    return false
  }

  const localStorage = localStore

  const basicSessions: BasicSession[] = sessions.map(s => {
    return {
      id: s.id,
      colorCode: s.colorCode,
      main: s.main,
      title: s.title,
      groups: s.groups,
      windowPos: s.windowPos
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
    await Promise.all([
      localStorage.set(SessionsKeys.basic, basicSessions),
      localStorage.set(SessionsKeys.open, sessionsOpenStatus),
      localStorage.set(SessionsKeys.tab, sessionsTabs)
    ])
  } catch (error) {
    logger.error('ERROR: could not set the sessions correctly -> store/sessions/setAll', error)
    return false
  }
  await refreshSessionStatus()
  return true
}

export default setAll