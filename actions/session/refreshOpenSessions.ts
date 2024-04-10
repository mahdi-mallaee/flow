import store from "~store"

/**
 * Refreshes the open status of all saved sessions by checking if their associated windows are still open.
 * This function is used to ensure the UI accurately reflects which sessions are currently open.
 */
const refreshOpenSessions = async () => {
  const sessions = await store.sessions.getAll()
  const windows = await chrome.windows.getAll()

  for (const session of sessions) {
    const openWindowIndex = windows.findIndex(w => w.id === session.windowId)
    if (openWindowIndex >= 0) {
      await store.sessions.setOpenStatus(session.id, true)
    } else {
      await store.sessions.setOpenStatus(session.id, false)
    }
  }

}

export default refreshOpenSessions