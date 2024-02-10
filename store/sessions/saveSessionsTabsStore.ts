import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionTabsStore, type Tab } from "~utils/types"
import refreshSessionsStatusStore from "./refreshSessionsStatusStore"

const saveSessionsTabsStore = async (sessionId: string, tabs: Tab[]) => {
  const localStorage = new Storage({ area: 'local' })
  const storedTabs: SessionTabsStore[] = await localStorage.get(SessionsKeys.tab) || []
  const storedTab = storedTabs.find(st => st.sessionId === sessionId)
  if (storedTab && tabs) {
    storedTab.tabs = tabs
    await localStorage.set(SessionsKeys.tab, storedTabs)
    await refreshSessionsStatusStore()
  }
}

export default saveSessionsTabsStore