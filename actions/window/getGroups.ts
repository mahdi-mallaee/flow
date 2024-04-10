import type { TabGroup } from "~utils/types"

/**
 * Retrieves the tab groups for the specified window.
 *
 * @param windowId - The ID of the window to retrieve the tab groups for.
 * @returns A Promise that resolves to an array of `TabGroup` objects representing the tab groups in the specified window.
 */
const getGroups = async (windowId: number): Promise<TabGroup[]> => {
  const windowGroups = await chrome.tabGroups.query({ windowId })
  const groups: TabGroup[] = windowGroups.map(group => {
    return {
      id: group.id,
      title: group.title || '',
      color: group.color,
      collapsed: group.collapsed
    }
  })
  return groups || []
}

export default getGroups