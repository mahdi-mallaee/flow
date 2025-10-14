import actions from "~actions"
import Store from "~store"

const refreshGroups = async () => {
  const sessions = await Store.sessions.getOpenStatus()
  for (const session of sessions) {
    if (session.isOpen) {
      const groups = await actions.window.getGroups(session.windowId)
      if (groups) {
        await Store.sessions.basicUpdate(session.sessionId, { groups })
      }
    }
  }
}

export default refreshGroups