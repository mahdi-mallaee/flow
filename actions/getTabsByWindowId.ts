import type { Tab } from "~utils/types"

const getTabsByWindowId = async (windowId: number): Promise<Tab[]> => {
  const chromeTabs = await chrome.tabs.query({ windowId })
  const tabs: Tab[] = chromeTabs.map(tab => {
    return { id: tab.id, url: tab.url || tab.pendingUrl, windowId: tab.windowId, groupId: tab.groupId, index: tab.index }
  })
  return tabs
}

export default getTabsByWindowId