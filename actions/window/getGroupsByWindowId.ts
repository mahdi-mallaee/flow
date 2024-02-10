import type { TabGroup } from "~utils/types"

const getGroupsByWindowId = async (windowId: number): Promise<TabGroup[]> => {
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

export default getGroupsByWindowId