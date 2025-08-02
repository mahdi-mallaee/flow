import { type OpenSessionInput, type Tab } from "~utils/types";
import store from "~store";
import actions from "~actions";
import { NEW_TAB_URL, WINDOWID_NONE } from "~utils/constants";

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
const open = async (sessionId: string, alterSettingsBehavior = false, currentWindowId?: number, exludedTabIndex?: number): Promise<number> => {

  if (!location.href.includes('background')) {
    actions.message.openSession({ sessionId, alterSettingsBehavior, currentWindowId, exludedTabIndex })
    return
  }

  const startTime = Date.now()

  let windowId = WINDOWID_NONE

  const { openSessionInCurrentWindow, deleteNewTabsWhenOpeningSession, clearHistoryAfterSessionOpening } = await store.settings.getAll()
  // if ctrl key is being held this setting will be altered 
  const openInCurrentWindow = alterSettingsBehavior ? !openSessionInCurrentWindow : openSessionInCurrentWindow

  if (openInCurrentWindow) {
    windowId = actions.window.checkId(currentWindowId) ? currentWindowId : (await chrome.windows.getCurrent()).id

    const openSessions = await store.sessions.getOpenStatus()
    const currentSessionIndex = openSessions.findIndex(s => s.windowId === windowId)
    if (currentSessionIndex >= 0) {
      // closing the current open session
      const currentSessionId = openSessions[currentSessionIndex].sessionId
      if (currentSessionId) {
        await store.sessions.setOpenStatus(currentSessionId, { isOpen: false, windowId: WINDOWID_NONE })
      } else {
        windowId = await actions.window.create(sessionId)
      }
    } else {
      // opening a new window if window is an unsavedWindow
      windowId = await actions.window.create(sessionId)
    }

  } else {
    windowId = await actions.window.create(sessionId)
  }
  let sessionTabs: Tab[] = await store.sessions.getTabs(sessionId)
  if (deleteNewTabsWhenOpeningSession) {
    sessionTabs = sessionTabs.filter(t => t.url !== NEW_TAB_URL)
    if (sessionTabs.length < 1) {
      sessionTabs = [{ groupId: -1, id: -1, index: 0, pinned: false, url: NEW_TAB_URL, windowId, iconUrl: "", title: "" }]
    }
  }
  const groups = await store.sessions.getGroups(sessionId)
  await actions.window.update(windowId, sessionTabs, groups, exludedTabIndex)
  actions.window.setBadgeColors({sessionId})
  // set the session as open and assign the window id to it for updates
  await store.sessions.setOpenStatus(sessionId, { isOpen: true, windowId })

  await actions.session.refreshGroups()

  if(clearHistoryAfterSessionOpening){
    chrome.history.deleteRange({ startTime, endTime: Date.now() })
  }

  await actions.window.refreshUnsavedWindows()
  await actions.session.refreshTabs()

  return windowId
}

export default open