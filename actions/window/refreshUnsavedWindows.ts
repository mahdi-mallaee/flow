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
  const unsavedWindows: UnsavedWindow[] = []
  const windows = await chrome.windows.getAll({ populate: true })

  const sessionWindowIds = new Set(sessions.map(session => session.windowId))

  for (const window of windows) {
    if (!sessionWindowIds.has(window.id)) {
      unsavedWindows.push({
        id: window.id,
        tabsCount: window.tabs?.length || 0
      })
    }
  }

  if (!onlyGet) {
    await store.windows.setUnsavedWindows(unsavedWindows)
  }

  return unsavedWindows
}

export default refreshUnsavedWindows