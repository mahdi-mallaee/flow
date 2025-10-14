import Store from "~store";

const refreshWindowPositions = async () => {
  const sessions = await Store.sessions.getAll()
  for (const session of sessions) {
    if (session.isOpen && !session.freeze) {
      const window = await chrome.windows.get(session.windowId)
      const windowPos = {
        top: window.top,
        left: window.left,
        height: window.height,
        width: window.width
      }
      await Store.sessions.basicUpdate(session.id, { windowPos })
    }
  }
}

export default refreshWindowPositions