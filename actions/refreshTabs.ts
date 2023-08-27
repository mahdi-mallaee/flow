import getTabsByWindowId from "./getTabsByWindowId"
import Store from "~store"

const refreshTabs = async () => {
  const sessions = await Store.sessions.getAll()

  for (const session of sessions) {
    const tabs = await getTabsByWindowId(session.windowId)
    if (tabs && tabs.length > 0) {
      session.tabs = tabs
      Store.sessions.saveTabs(session.id, tabs)
    }
  }

  // const unsavedWindows: UnsavedWindow[] = await getUnsavedWindows(sessions)
  // for (const window of unsavedWindows) {
  //   const tabs = await getTabsByWindowId(window.id)
  //   if (tabs && tabs.length > 0) {
  //     window.tabsCount = tabs.length
  //   }
  // }

  // await store.set(StoreKeys.unsavedWindows, unsavedWindows)

}

export default refreshTabs