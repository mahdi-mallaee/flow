import actions from "~actions"
import type { Tab, TabGroup } from "~utils/types"

const groupTabs = async (groups: TabGroup[], tabs: Tab[], windowTabs: Tab[], windowId: number) => {
  if (!groups || !groups.length || groups.length === 0 || !actions.window.checkId(windowId)) { return }

  const groupPromises = groups.map(async (group) => {
    const tabIds: number[] = tabs
      .filter(tab => tab.groupId === group.id)
      .map(tab => windowTabs[tab.index].id)

    if (tabIds.length > 0) {
      const newTabGroupId = await chrome.tabs.group({ tabIds, createProperties: { windowId } })
      await chrome.tabGroups.update(newTabGroupId, { collapsed: group.collapsed, color: group.color, title: group.title })
    }
  })

  await Promise.all(groupPromises)
}

export default groupTabs