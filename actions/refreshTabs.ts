import { StoreKeys, type Session, type Tab } from "~utils/types"
import { Storage } from '@plasmohq/storage'
import getTabsByWindowId from "./getTabsByWindowId"

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

}

export default refreshTabs