import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionTabsStore, type Tab } from "~utils/types"
import refreshSessionsStatus from "./refreshSessionsStatus"

const saveSessionsTabs = async (sessionId: string, tabs: Tab[]) => {
  const store = new Storage({ area: 'local' })
  const storedTabs: SessionTabsStore[] = await store.get(SessionsKeys.tab)
  const storedTab = storedTabs.find(st => st.sessionId === sessionId)
  if (storedTab && tabs) {
    storedTab.tabs = tabs
    await store.set(SessionsKeys.tab, storedTabs)
    await refreshSessionsStatus()
  }
}

export default saveSessionsTabs