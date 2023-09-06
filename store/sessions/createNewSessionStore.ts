import { Storage } from "@plasmohq/storage";
import { type Session, SessionsKeys, type BasicSession, type SessionOpenStatus, type SessionTabsStore } from "~utils/types";
import refreshSessionsStatusStore from "./refreshSessionsStatusStore";

const createNewSessionStore = async (session: Session) => {
  const store = new Storage({ area: "local" })

  let basicSessions: BasicSession[] = await store.get(SessionsKeys.basic) || []
  let sessionsOpenStatus: SessionOpenStatus[] = await store.get(SessionsKeys.open) || []
  let sessionsTabs: SessionTabsStore[] = await store.get(SessionsKeys.tab) || []

  const newBasicSessions = {
    id: session.id,
    title: session.title,
    colorCode: session.colorCode,
    main: session.main,
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

  await store.set(SessionsKeys.basic, basicSessions)
  await store.set(SessionsKeys.open, sessionsOpenStatus)
  await store.set(SessionsKeys.tab, sessionsTabs)
  await refreshSessionsStatusStore()
}

export default createNewSessionStore