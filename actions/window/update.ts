import actions from "~actions"
import groupTabs from "~actions/session/groupTabs"
import setOpenTabs from "~actions/session/setOpenTabs"
import type { Tab, TabGroup } from "~utils/types"

/**
 * Updates the tabs and tab groups in the specified window.
 * 
 * First length of the sessions tabs is compared with the window tabs and
 * tabs will be created or removed if needed.
 * 
 * Then the tabs url and other properties will be updated.
 * 
 * Then the tabs will grouped if there is any groups.
 *
 * @param windowId - The ID of the window to update.
 * @param tabs - The new tabs to be displayed in the window.
 * @param groups - The new tab groups to be applied to the window.
 * @returns A promise that resolves when the update is complete.
 */
const update = async (windowId: number, tabs: Tab[], groups: TabGroup[]) => {
  let currentWindowTabs = await actions.window.getTabs(windowId)

  // this approach is used to ensuure parallel run for faster update
  const tabPromises = []
  if (currentWindowTabs.length > tabs.length) {
    for (let i = 0; i < currentWindowTabs.length - tabs.length; i++) {
      tabPromises.push(chrome.tabs.remove(currentWindowTabs[i].id))
    }
  } else if (currentWindowTabs.length < tabs.length) {
    for (let i = 0; i < tabs.length - currentWindowTabs.length; i++) {
      tabPromises.push(chrome.tabs.create({ windowId: windowId }))
    }
  }
  await Promise.all(tabPromises)

  currentWindowTabs = await actions.window.getTabs(windowId)
  // set opened tabs to discard them after opening a session
  await setOpenTabs(currentWindowTabs)
  const updatePromises = currentWindowTabs.map((tab, i) => chrome.tabs.update(tab.id, {
    url: tabs[i].url, pinned: tabs[i].pinned
  }))

  // activating the last tab in the window
  chrome.tabs.update(currentWindowTabs[currentWindowTabs.length - 1].id, { active: true })

  await chrome.tabs.ungroup(currentWindowTabs.map(t => t.id))
  await groupTabs(groups, tabs, currentWindowTabs, windowId)
  await Promise.all(updatePromises)
}

export default update