import { type UnsavedWindow, type SessionOpenStatus } from "~utils/types"
import store from "~store"

/**
 * Refreshes the list of unsaved windows by checking the current open windows and comparing them to the session status.
 * 
 * @param onlyGet - If true, the function will only return the list of unsaved windows without updating the store.
 * @returns An array of `UnsavedWindow` objects representing the unsaved windows.
 */
const refreshUnsavedWindows = async (onlyGet = false): Promise<UnsavedWindow[]> => {
  const sessions: SessionOpenStatus[] = await store.sessions.getOpenStatus()
  let unsavevdWindows: UnsavedWindow[] = []
  const windows = await chrome.windows.getAll()

  for (const window of windows) {
    let index = -1
    if (sessions) {
      index = sessions.findIndex(session => { return session.windowId === window.id })
    }
    if (index === -1) {
      const tabsCount = (await chrome.tabs.query({ windowId: window.id })).length
      unsavevdWindows.push({
        id: window.id,
        tabsCount
      })
    }
  }
  if (!onlyGet) {
    await store.windows.setUnsavedWindows(unsavevdWindows)
  }

  return unsavevdWindows
}

export default refreshUnsavedWindows