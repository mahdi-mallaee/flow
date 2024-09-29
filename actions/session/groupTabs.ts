import actions from "~actions"
import type { Tab, TabGroup } from "~utils/types"

const groupTabs = async (groups: TabGroup[], tabs: Tab[], windowId: number, tryCount = 0) => {
  if (!groups || !groups.length || groups.length === 0 || !actions.window.checkId(windowId)) { return }
  const groupPromises = groups.map(async (group) => {
    const windowTabs = await actions.window.getTabs(windowId)
    const tabIds: number[] = tabs
      .filter(tab => tab.groupId === group.id)
      .map(tab => windowTabs[tab.index].id)

    if (tabIds.length > 0) {
      try {
        const newTabGroupId = await chrome.tabs.group({ tabIds, createProperties: { windowId } })
        await chrome.tabGroups.update(newTabGroupId, { collapsed: group.collapsed, color: group.color, title: group.title })
        const groupCheck = await actions.window.getGroups(windowId)
        if (groupCheck.length !== groups.length && tryCount < 3) {
          groupTabs(groups, tabs, windowId, tryCount + 1)
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('ERROR: could not group tabs correctly -> actions/session/groupTabs l.12', error)
        }
      }
    }
  })
  try {
    await Promise.allSettled(groupPromises)
  } catch {
    console.log("Error grouping tabs")
  }
}

export default groupTabs