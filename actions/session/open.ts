import { type OpenSessionInput, type Tab } from "~utils/types";
import store from "~store";
import actions from "~actions";
import { WINDOWID_NONE } from "~utils/constants";

/**
 * Opens a session in the current window or a new window, depending on the user's settings.
 *
 * @param sessionId - The ID of the session to open.
 * @param currentWindowId - The ID of the current window, if the session is to be opened in the current window.
 * @param alterSettingsBehavior - Whether to override the user's settings for opening the session.
 *  If user holds the ctrl key, the settings behaviour will be altered.
 * @param exludedTabIndex - The index of the tab that should not be discarded in the opened window.
 * 
 * @returns The ID of the window in which the session was opened.
 * 
 * @flow 
 * get sessions tabs and groups ->
 * 
 * if open in current window ->
 *    close the current open session ->
 * else if open in a new window ->
 *    create a new window ->
 * 
 * update the new window tabs ->
 * set the session as open ->
 * delete the recent history !
 */
const open = async ({ sessionId, currentWindowId, alterSettingsBehavior = false, exludedTabIndex }: OpenSessionInput): Promise<number> => {
  const startTime = Date.now()

  const sessionTabs: Tab[] = await store.sessions.getTabs(sessionId)
  const groups = await store.sessions.getGroups(sessionId)

  let windowId = WINDOWID_NONE

  const { openSessionInCurrentWindow } = await store.settings.getAll()
  const openInCurrentWindow = alterSettingsBehavior ? !openSessionInCurrentWindow : openSessionInCurrentWindow

  if (openInCurrentWindow) {
    windowId = actions.window.checkId(currentWindowId) ? currentWindowId : (await chrome.windows.getCurrent()).id

    // closing the current open session
    const openSessions = await store.sessions.getOpenStatus()
    const currentSessionIndex = openSessions.findIndex(s => s.windowId === windowId)
    if (currentSessionIndex >= 0) {
      const currentSessionId = openSessions[currentSessionIndex].sessionId
      if (currentSessionId) {
        await store.sessions.setOpenStatus(currentSessionId, false)
        await store.sessions.setWindowId(currentSessionId, WINDOWID_NONE)
      }
    }

  } else {
    windowId = await actions.window.create()
  }

  await actions.window.update(windowId, sessionTabs, groups, exludedTabIndex)

  // set the session as open and assign the window id to it for updates
  await store.sessions.setOpenStatus(sessionId, true)
  await store.sessions.setWindowId(sessionId, windowId)

  chrome.history.deleteRange({ startTime, endTime: Date.now() })
  await actions.window.refreshUnsavedWindows()

  return windowId
}

export default open