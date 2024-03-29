import type { Tab, TabGroup } from "~utils/types"

const groupTabs = async (groups: TabGroup[], tabs: Tab[], windowTabs: Tab[], windowId: number) => {
  for (const group of groups) {
    const tabIds: number[] = []
    for (const tab of tabs) {
      if (tab.groupId === group.id) {
        tabIds.push(windowTabs[tab.index].id)
      }
    }
    const groupId = await chrome.tabs.group({ tabIds, createProperties: { windowId } })
    await chrome.tabGroups.update(groupId, { collapsed: group.collapsed, color: group.color, title: group.title })
  }
}

export default groupTabs