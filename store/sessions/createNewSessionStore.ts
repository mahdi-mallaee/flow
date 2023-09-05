import { Storage } from "@plasmohq/storage";
import { type Session, SessionsKeys, type BasicSession, type SessionOpenStatus, type SessionTabsStore } from "~utils/types";
import refreshSessionsStatusStore from "./refreshSessionsStatusStore";

const createNewSessionStore = async (session: Session) => {
  const store = new Storage({ area: "local" })

  let basics: BasicSession[] = await store.get(SessionsKeys.basic) || []
  let opens: SessionOpenStatus[] = await store.get(SessionsKeys.open) || []
  let tabs: SessionTabsStore[] = await store.get(SessionsKeys.tab) || []

  const newBasic = {
    id: session.id,
    title: session.title,
    colorCode: session.colorCode,
    main: session.main,
  }
  basics = [newBasic, ...basics]

  const newOpenSession: SessionOpenStatus = {
    isOpen: session.isOpen,
    sessionId: session.id,
    windowId: session.windowId
  }
  opens = [newOpenSession, ...opens]

  const newSessionTabs: SessionTabsStore = {
    sessionId: session.id,
    tabs: session.tabs
  }
  tabs = [newSessionTabs, ...tabs]

  await store.set(SessionsKeys.basic, basics)
  await store.set(SessionsKeys.open, opens)
  await store.set(SessionsKeys.tab, tabs)
  await refreshSessionsStatusStore()
}

export default createNewSessionStore