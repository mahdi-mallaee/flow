import type { Session, UnsavedWindow } from "~utils/types"

const getUnsavedWindows = async (sessions: Session[]): Promise<UnsavedWindow[]> => {
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
  return unsavevdWindows
}

export default getUnsavedWindows