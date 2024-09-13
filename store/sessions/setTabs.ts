import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionTabsStore, type Tab } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"

const setTabs = async (sessionId: string, tabs: Tab[]) => {
  const localStorage = new Storage({ area: 'local' })
  const storedTabs: SessionTabsStore[] = await localStorage.get(SessionsKeys.tab) || []
  const storedTab = storedTabs.find(st => st.sessionId === sessionId)
  if (storedTab) {
    if (tabs && tabs.length > 0) {
      storedTab.tabs = tabs
    }
  } else {
    storedTabs.push({ sessionId: sessionId, tabs })
  }
  await localStorage.set(SessionsKeys.tab, storedTabs)
  await refreshSessionStatus()
}

export default setTabs