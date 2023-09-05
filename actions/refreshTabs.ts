import getTabsByWindowId from "./getTabsByWindowId"
import Store from "~store"
import refreshUnsavedWindows from "./refreshUnsavedWindows"
import type { UnsavedWindow } from "~utils/types"

const refreshTabs = async () => {
  const sessions = await Store.sessions.getAllOpenStatus()

  for (const session of sessions) {
    if (session.isOpen) {
      const tabs = await getTabsByWindowId(session.windowId)
      if (tabs && tabs.length > 0) {
        await Store.sessions.saveTabs(session.sessionId, tabs)
      }
    }
  }

  const unsavedWindows: UnsavedWindow[] = await refreshUnsavedWindows(true)
  for (const window of unsavedWindows) {
    const tabs = await getTabsByWindowId(window.id)
    if (tabs && tabs.length > 0) {
      window.tabsCount = tabs.length
    }
  }

  await Store.unsavedWindows.setAll(unsavedWindows)
}

export default refreshTabs