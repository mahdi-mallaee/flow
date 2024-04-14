import actions from "~actions"
import groupTabs from "~actions/session/groupTabs"
import setOpenTabs from "~actions/session/setOpenTabs"
import type { Tab, TabGroup } from "~utils/types"

/**
 * Updates the tabs and tab groups in the specified window.
 * 
 * First sessions tabs are created and then current window tabs will be deleted
 *
 * @param windowId - The ID of the window to update.
 * @param tabs - The new tabs to be displayed in the window.
 * @param groups - The new tab groups to be applied to the window.
 * @returns A promise that resolves when the update is complete.
 */
const update = async (windowId: number, tabs: Tab[], groups: TabGroup[]) => {
  let currentWindowTabs = await actions.window.getTabs(windowId)

  // this approach is used to ensuure parallel run for faster update
  const newTabsPromise = tabs.map(t => {
    return chrome.tabs.create({
      url: t.url,
      pinned: t.pinned,
      windowId: windowId,
    })
  })

  const currentTabsPromise = currentWindowTabs.map(t => {
    return chrome.tabs.remove(t.id)
  })

  await Promise.all(newTabsPromise)
  await Promise.all(currentTabsPromise)
  
  await groupTabs(groups, tabs, windowId)
  currentWindowTabs = await actions.window.getTabs(windowId)
  await setOpenTabs(currentWindowTabs)
  await actions.session.refreshGroups()
}

export default update