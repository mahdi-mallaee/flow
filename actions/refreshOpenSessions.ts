import Store from "~store"

const refreshOpenSessions = async () => {
  const sessions = await Store.sessions.getAll()
  const windows = await chrome.windows.getAll()

  for (const session of sessions) {
    const openWindowIndex = windows.findIndex(w => w.id === session.windowId)
    if (openWindowIndex >= 0) {
      await Store.sessions.changeOpenStatus(session.id, true)
    } else {
      await Store.sessions.changeOpenStatus(session.id, false)
    }
  }

}

export default refreshOpenSessions