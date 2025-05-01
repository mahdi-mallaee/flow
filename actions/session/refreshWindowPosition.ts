import store from "~store";

const refreshWindowPositions = async () => {
  const sessions = await store.sessions.getAll()
  for (const session of sessions) {
    if (session.isOpen && !session.freeze) {
      const window = await chrome.windows.get(session.windowId)
      const windowPos = {
        top: window.top,
        left: window.left,
        height: window.height,
        width: window.width
      }
      await store.sessions.basicUpdate(session.id, { windowPos })
    }
  }
}

export default refreshWindowPositions