import { type Tab } from "~utils/types";
import store from "~store";
import actions from "~actions";
import groupTabs from "./groupTabs";
import setOpenTabs from "./setOpenTabs";
import { WINDOWID_NONE } from "~utils/constants";

const open = async (sessionId: string, currentWindowId?: number): Promise<number> => {
  const startTime = Date.now()

  const settings = await store.settings.getAll()
  const sessionTabs: Tab[] = await store.sessions.getTabs(sessionId)
  let windowId = WINDOWID_NONE
  const groups = await store.sessions.getGroups(sessionId)

  if (settings.openSessionInCurrentWindow) {
    windowId = actions.window.checkId(currentWindowId) ? currentWindowId : (await chrome.windows.getCurrent()).id

    const openSessions = await store.sessions.getOpenStatus()
    const currentSessionIndex = openSessions.findIndex(s => s.windowId === windowId)
    if (currentSessionIndex >= 0) {
      const currentSessionId = openSessions[currentSessionIndex].sessionId
      if (currentSessionId) {
        await store.sessions.setOpenStatus(currentSessionId, false)
        await store.sessions.setWindowId(currentSessionId, WINDOWID_NONE)
      }
    }

    await actions.window.update(windowId, sessionTabs, groups)

    await store.sessions.setWindowId(sessionId, windowId)
    await store.sessions.setOpenStatus(sessionId, true)


  } else {

    windowId = await actions.window.create(sessionTabs.map(t => { return t.url }))
    await store.sessions.setOpenStatus(sessionId, true)
    await store.sessions.setWindowId(sessionId, windowId)
    await actions.window.changeRecentWindowId(windowId)
    const windowTabs = await actions.window.getTabs(windowId)
    await groupTabs(groups, sessionTabs, windowTabs, windowId)
    setOpenTabs(windowTabs)
  }

  chrome.history.deleteRange({ startTime, endTime: Date.now() })
  await actions.window.refreshUnsavedWindows()

  return windowId
}

export default open