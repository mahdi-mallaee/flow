import actions from "~actions"
import groupTabs from "~actions/session/groupTabs"
import setOpenTabs from "~actions/session/setOpenTabs"
import logger from "~utils/logger"
import type { Tab, TabGroup } from "~utils/types"

/**
 * Updates the tabs and tab groups in the specified window.
 * 
 * First sessions tabs are created and then current window tabs will be deleted
 *
 * @param windowId - The ID of the window to update.
 * @param tabs - The new tabs to be displayed in the window.
 * @param groups - The new tab groups to be applied to the window.
 * @param excludeTabIndex - The index of the tab that needs to be excluded from discarding.
 * 
 * @returns A promise that resolves when the update is complete.
 */
const update = async (windowId: number, tabs: Tab[], groups: TabGroup[], excludeTabIndex?: number) => {
  let currentWindowTabs = await actions.window.getTabs(windowId)

  const newTabsPromise = tabs.map(t => {
    return chrome.tabs.create({
      url: t.url,
      pinned: t.pinned,
      windowId: windowId,
    })
  })

  if (newTabsPromise.length === 0) {
    newTabsPromise.push(chrome.tabs.create({}))
  }

  const currentTabsPromise = currentWindowTabs.map(t => {
    return chrome.tabs.remove(t.id)
  })

  try {
    await Promise.allSettled(newTabsPromise)
    await Promise.allSettled(currentTabsPromise)
  } catch (error) {
    logger.error("Error updating tabs", error)
  }

  await groupTabs(groups, tabs, windowId)
  currentWindowTabs = await actions.window.getTabs(windowId)
  await setOpenTabs(currentWindowTabs, excludeTabIndex)
}

export default update