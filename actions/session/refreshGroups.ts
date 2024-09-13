import actions from "~actions"
import store from "~store"

const refreshGroups = async () => {
  const sessions = await store.sessions.getOpenStatus()
  for (const session of sessions) {
    if (session.isOpen) {
      const groups = await actions.window.getGroups(session.windowId)
      if (groups) {
        await store.sessions.basicUpdate(session.sessionId, { groups })
      }
    }
  }
}

export default refreshGroups