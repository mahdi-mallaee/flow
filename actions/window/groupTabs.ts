import actions from "~actions"
import logger from "~utils/logger"
import type { Tab, TabGroup } from "~utils/types"

const groupTabs = async (groups: TabGroup[], tabs: Tab[], windowId: number, tryCount = 0) => {
  if (!chrome.tabGroups || !chrome.tabs.group || !groups || !groups.length || groups.length === 0 || !actions.window.checkId(windowId)) { return }
  const groupPromises = groups.map(async (group) => {
    const windowTabs = await actions.window.getTabs(windowId)
    const tabIds: number[] = tabs
      .filter(tab => tab.groupId === group.id)
      .map(tab => (windowTabs[tab.index] || windowTabs.find(wt => wt.index === tab.index))?.id)
      .filter((id): id is number => typeof id === "number" && id > 0)

    if (tabIds.length > 0) {
      try {
        const newTabGroupId = (await chrome.tabs.group({
          tabIds: tabIds as [number, ...number[]],
          createProperties: { windowId }
        })) as number
        await chrome.tabGroups.update(newTabGroupId, { collapsed: group.collapsed, color: group.color as chrome.tabGroups.Color, title: group.title })
        const groupCheck = await actions.window.getGroups(windowId)
        if (groupCheck.length !== groups.length && tryCount < 3) {
          await groupTabs(groups, tabs, windowId, tryCount + 1)
        }
      } catch (error) {
        logger.error('ERROR: could not group tabs correctly -> actions/window/groupTabs', error)
      }
    }
  })
  try {
    await Promise.allSettled(groupPromises)
  } catch (error) {
    logger.error("Error grouping tabs", error)
  }
}

export default groupTabs