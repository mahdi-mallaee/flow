import actions from "~actions"
import groupTabs from "~actions/session/groupTabs"
import setOpenTabs from "~actions/session/setOpenTabs"
import type { Tab, TabGroup } from "~utils/types"

const update = async (windowId: number, tabs: Tab[], groups: TabGroup[]) => {
  let currentWindowTabs = await actions.window.getTabs(windowId)

  if (currentWindowTabs.length > tabs.length) {
    for (let i = 0; i < currentWindowTabs.length - tabs.length; i++) {
      await chrome.tabs.remove(currentWindowTabs[i].id)
    }
  } else if (currentWindowTabs.length < tabs.length) {
    for (let i = 0; i < tabs.length - currentWindowTabs.length; i++) {
      await chrome.tabs.create({ windowId: windowId })
    }
  }

  currentWindowTabs = await actions.window.getTabs(windowId)
  await setOpenTabs(currentWindowTabs)
  for (let i = 0; i < currentWindowTabs.length; i++) {
    chrome.tabs.update(currentWindowTabs[i].id, { url: tabs[i].url })
  }
  chrome.tabs.update(currentWindowTabs[currentWindowTabs.length - 1].id, { active: true })

  await chrome.tabs.ungroup(currentWindowTabs.map(t => t.id))
  groupTabs(groups, tabs, currentWindowTabs, windowId)
}

export default update