import type { TabGroup } from "~utils/types"

const getGroups = async (windowId: number): Promise<TabGroup[]> => {
  if (!chrome.tabGroups) return []
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