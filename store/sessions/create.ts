import { Storage } from "@plasmohq/storage";
import { type Session, SessionsKeys, type BasicSession, type SessionOpenStatus, type SessionTabsStore } from "~utils/types";
import refreshSessionStatus from "./refreshSessionStatus";

const create = async (session: Session) => {
  const localStorage = new Storage({ area: "local" })

  let basicSessions: BasicSession[] = await localStorage.get(SessionsKeys.basic) || []
  let sessionsOpenStatus: SessionOpenStatus[] = await localStorage.get(SessionsKeys.open) || []
  let sessionsTabs: SessionTabsStore[] = await localStorage.get(SessionsKeys.tab) || []

  const newBasicSessions = {
    id: session.id,
    title: session.title,
    colorCode: session.colorCode,
    main: session.main,
    groups: session.groups
  }
  basicSessions = [newBasicSessions, ...basicSessions]

  const newSessionsOpenStatus: SessionOpenStatus = {
    isOpen: session.isOpen,
    sessionId: session.id,
    windowId: session.windowId
  }
  sessionsOpenStatus = [newSessionsOpenStatus, ...sessionsOpenStatus]

  const newSessionsTabs: SessionTabsStore = {
    sessionId: session.id,
    tabs: session.tabs
  }
  sessionsTabs = [newSessionsTabs, ...sessionsTabs]

  await localStorage.set(SessionsKeys.basic, basicSessions)
  await localStorage.set(SessionsKeys.open, sessionsOpenStatus)
  await localStorage.set(SessionsKeys.tab, sessionsTabs)
  await refreshSessionStatus()
}

export default create