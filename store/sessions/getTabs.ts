import { localStore } from "~utils/storageManager"
import { SessionsKeys, type SessionTabsStore, type Tab } from "~utils/types"

const getTabs = async (sessionId: string): Promise<Tab[]> => {
  const localStorage = localStore
  const sessionsTabs: SessionTabsStore[] = await localStorage.get(SessionsKeys.tab) || []
  const index = sessionsTabs.findIndex(st => st.sessionId === sessionId)
  let tabs: Tab[] = []
  if (index >= 0 && sessionsTabs[index].tabs) {
    tabs = sessionsTabs[index].tabs
  }

  return tabs
}

export default getTabs