import { Storage } from "@plasmohq/storage";
import { type Session, SessionsKeys, type BasicSession, type WindowIdStore, type OpenSessionStore, type SessionTabsStore } from "~utils/types";
import refreshSessionsStatus from "./refreshSessionsStatus";

const createNewSession = async (session: Session) => {
  const store = new Storage({ area: "local" })

  let basics: BasicSession[] = await store.get(SessionsKeys.basic) || []
  let windowIds: WindowIdStore[] = await store.get(SessionsKeys.windowId) || []
  let opens: OpenSessionStore[] = await store.get(SessionsKeys.open) || []
  let tabs: SessionTabsStore[] = await store.get(SessionsKeys.tab) || []

  const newBasic = {
    id: session.id,
    title: session.title,
    colorCode: session.colorCode,
    main: session.main,
  }
  basics = [newBasic, ...basics]

  const newWindowId: WindowIdStore = {
    sessionId: session.id,
    windowId: session.windowId
  }
  windowIds = [newWindowId, ...windowIds]

  const newOpenSession: OpenSessionStore = {
    isOpen: session.isOpen,
    sessionId: session.id
  }
  opens = [newOpenSession, ...opens]

  const newSessionTabs: SessionTabsStore = {
    sessionId: session.id,
    tabs: session.tabs
  }
  tabs = [newSessionTabs, ...tabs]

  await store.set(SessionsKeys.basic, basics)
  await store.set(SessionsKeys.windowId, windowIds)
  await store.set(SessionsKeys.open, opens)
  await store.set(SessionsKeys.tab, tabs)
  await refreshSessionsStatus()
}

export default createNewSession