import { type UnsavedWindow, type SessionOpenStatus } from "~utils/types"
import Store from "~store"
import { WINDOWID_NONE } from "~utils/constants"

const refreshUnsavedWindows = async (onlyGet = false): Promise<UnsavedWindow[]> => {
  const sessions: SessionOpenStatus[] = await Store.sessions.getAllOpenStatus()
  let unsavevdWindows: UnsavedWindow[] = []
  const windows = await chrome.windows.getAll()

  for (const window of windows) {
    let index = WINDOWID_NONE
    if (sessions) {
      index = sessions.findIndex(session => { return session.windowId === window.id })
    }
    if (index === WINDOWID_NONE) {
      const tabsCount = (await chrome.tabs.query({ windowId: window.id })).length
      unsavevdWindows.push({
        id: window.id,
        tabsCount
      })
    }
  }
  if (!onlyGet) {
    await Store.unsavedWindows.setAll(unsavevdWindows)
  }

  return unsavevdWindows
}

export default refreshUnsavedWindows