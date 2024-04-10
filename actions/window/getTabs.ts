import { NEW_TAB_URL } from "~utils/constants"
import type { Tab } from "~utils/types"

/**
 * Retrieves an array of tabs for the specified window.
 *
 * @param windowId - The ID of the window to retrieve tabs for.
 * @returns A Promise that resolves to an array of `Tab` objects representing the tabs in the specified window.
 */
const getTabs = async (windowId: number): Promise<Tab[]> => {
  const chromeTabs = await chrome.tabs.query({ windowId })
  const tabs: Tab[] = chromeTabs.map(tab => {
    return {
      id: tab.id,
      url: tab.pendingUrl || tab.url || NEW_TAB_URL,
      windowId: tab.windowId,
      groupId: tab.groupId || -1,
      index: tab.index,
      pinned: tab.pinned || false
    }
  })
  return tabs || []
}

export default getTabs