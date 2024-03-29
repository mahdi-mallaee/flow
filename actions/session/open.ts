import { type Tab } from "~utils/types";
import store from "~store";
import actions from "~actions";
import groupTabs from "./groupTabs";
import setOpenTabs from "./setOpenTabs";

const open = async (sessionId: string): Promise<number> => {
  const startTime = Date.now()

  const sessionTabs: Tab[] = await store.sessions.getTabs(sessionId)
  const newWindowId = await actions.window.create(sessionTabs.map(t => { return t.url }))
  const windowTabs = await actions.window.getTabs(newWindowId)
  const groups = await store.sessions.getGroups(sessionId)

  await store.sessions.setTabs(sessionId, windowTabs)
  await store.sessions.setOpenStatus(sessionId, true)
  await store.sessions.setWindowId(sessionId, newWindowId)

  setOpenTabs(windowTabs)
  await groupTabs(groups, sessionTabs, windowTabs, newWindowId)
  chrome.history.deleteRange({ startTime, endTime: Date.now() })
  await actions.window.refreshUnsavedWindows()
  await actions.window.changeRecentWindowId(newWindowId)
  return newWindowId
}

export default open