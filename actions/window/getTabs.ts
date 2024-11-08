import { NEW_TAB_URL } from "~utils/constants"
import type { Tab } from "~utils/types"

const getTabs = async (windowId: number): Promise<Tab[]> => {
  const chromeTabs = await chrome.tabs.query({ windowId })
  const tabs: Tab[] = chromeTabs.map(tab => {
    return {
      id: tab.id,
      url: tab.pendingUrl || tab.url || NEW_TAB_URL,
      windowId: tab.windowId,
      groupId: tab.groupId || -1,
      index: tab.index,
      pinned: tab.pinned || false,
      iconUrl: tab.favIconUrl || '',
      title: tab.title || ''
    }
  })
  return tabs || []
}

export default getTabs