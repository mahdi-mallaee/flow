import { StoreKeys, type Session, type Tab, type UnsavedWindow } from "~utils/types"
import { Storage } from '@plasmohq/storage'
import getTabsByWindowId from "./getTabsByWindowId"
import getUnsavedWindows  from "./getUnsavedWindows"

const refreshTabs = async () => {
  const store = new Storage({ area: 'local' })

  const sessions: Session[] = await store.get(StoreKeys.sessions)
  
  for (const session of sessions) {
    if (session.isOpen) {
      const tabs = await getTabsByWindowId(session.windowId)
      if (tabs && tabs.length > 0) {
        session.tabs = tabs
      }
    }
  }
  await store.set(StoreKeys.sessions, sessions)

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