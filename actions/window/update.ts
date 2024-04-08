import actions from "~actions"
import groupTabs from "~actions/session/groupTabs"
import setOpenTabs from "~actions/session/setOpenTabs"
import type { Tab, TabGroup } from "~utils/types"

const update = async (windowId: number, tabs: Tab[], groups: TabGroup[]) => {
  let currentWindowTabs = await actions.window.getTabs(windowId)

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
  await setOpenTabs(currentWindowTabs)
  const updatePromises = currentWindowTabs.map((tab, i) => chrome.tabs.update(tab.id, { url: tabs[i].url }))

  chrome.tabs.update(currentWindowTabs[currentWindowTabs.length - 1].id, { active: true })

  await chrome.tabs.ungroup(currentWindowTabs.map(t => t.id))
  await groupTabs(groups, tabs, currentWindowTabs, windowId)
  await Promise.all(updatePromises)
}

export default update