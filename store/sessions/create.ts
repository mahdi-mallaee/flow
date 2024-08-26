import { Storage } from "@plasmohq/storage";
import { type Session, SessionsKeys, type BasicSession, type SessionOpenStatus, type SessionTabsStore } from "~utils/types";
import refreshSessionStatus from "./refreshSessionStatus";

/**
 * Creates a new session and stores it in local storage.
 *
 * Session are seperated into three different parts to prevent race issues
 */
const create = async (session: Session): Promise<boolean> => {
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
    id: session.id,
    windowId: session.windowId
  }
  sessionsOpenStatus = [newSessionsOpenStatus, ...sessionsOpenStatus]

  const newSessionsTabs: SessionTabsStore = {
    id: session.id,
    tabs: session.tabs
  }
  sessionsTabs = [newSessionsTabs, ...sessionsTabs]

  /*
    Sessions tabs new value is not set to local storage correctly.
    Causing 'zero tab window' bug.
    So for now i set sessionsTabs twice just to be sure

    Creating the sesison in the background probably will fix the issue.
  */
  try {
    await localStorage.set(SessionsKeys.tab, sessionsTabs)
    await localStorage.set(SessionsKeys.tab, sessionsTabs)

    await localStorage.set(SessionsKeys.basic, basicSessions)
    await localStorage.set(SessionsKeys.basic, basicSessions)

    await localStorage.set(SessionsKeys.open, sessionsOpenStatus)
    await localStorage.set(SessionsKeys.open, sessionsOpenStatus)

    await refreshSessionStatus()
    return true
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("ERROR: could not set the sessions -> store/sessions/create l.40", error)
    }
    return false
  }
}

export default create