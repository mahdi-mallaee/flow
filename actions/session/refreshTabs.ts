import actions from "~actions"
import store from "~store"
import type { UnsavedWindow } from "~utils/types"

/*
  runs through sessions and unsavedWindows and by their windowId get the tabs and saves them in their appropriate place.
  saving tabs individualy by their event made a lot of problems so I just save them all after every event.
*/

const refreshTabs = async () => {
  const sessions = await store.sessions.getAllOpenStatus()

  for (const session of sessions) {
    if (session.isOpen) {
      const tabs = await actions.window.getTabs(session.windowId)
      if (tabs && tabs.length > 0) {
        await store.sessions.saveTabs(session.sessionId, tabs)
      }
    }
  }

  const unsavedWindows: UnsavedWindow[] = await actions.window.refreshUnsavedWindows(true)
  for (const window of unsavedWindows) {
    const tabs = await actions.window.getTabs(window.id)
    if (tabs && tabs.length > 0) {
      window.tabsCount = tabs.length
    }
  }

  await store.unsavedWindows.setAll(unsavedWindows)
}

export default refreshTabs