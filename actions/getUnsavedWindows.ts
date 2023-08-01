import type { Session } from "~utils/types"

const getUnsavedWindows = async (sessions: Session[]): Promise<chrome.windows.Window[]> => {
  let unsavevdWindows = []
  const windows = await chrome.windows.getAll()
  windows.forEach(window => {
    const index = sessions.findIndex(session => { return session.windowId === window.id })
    if (index === -1) {
      unsavevdWindows.push(window)
    }
  })
  return unsavevdWindows
}

export default getUnsavedWindows