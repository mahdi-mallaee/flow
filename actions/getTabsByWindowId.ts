import { WINDOWID_NONE } from "~utils/constants"
import type { Tab } from "~utils/types"

const getTabsByWindowId = async (windowId: number): Promise<Tab[]> => {
  const chromeTabs = await chrome.tabs.query({ windowId })
  const tabs: Tab[] = chromeTabs.map(tab => {
    return {
      id: tab.id,
      url: tab.pendingUrl || tab.url || 'chrome://newtab',
      windowId: tab.windowId,
      groupId: tab.groupId || WINDOWID_NONE,
      index: tab.index
    }
  })
  return tabs || []
}

export default getTabsByWindowId