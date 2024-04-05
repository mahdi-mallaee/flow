import actions from "~actions"
import setOpenTabs from "~actions/session/setOpenTabs"
import type { Tab } from "~utils/types"

const update = async (windowId: number, tabs: Tab[]) => {
  let currentWindowTabs = await actions.window.getTabs(windowId)

  if (currentWindowTabs.length > tabs.length) {
    for (let i = 0; i < currentWindowTabs.length - tabs.length; i++) {
      await chrome.tabs.remove(currentWindowTabs[i].id)
    }
    currentWindowTabs = await actions.window.getTabs(windowId)
    setOpenTabs(currentWindowTabs)
    for (let i = 0; i < currentWindowTabs.length; i++) {
      chrome.tabs.update(currentWindowTabs[i].id, { url: tabs[i].url })
    }
  } else if (currentWindowTabs.length < tabs.length) {
    for (let i = 0; i < tabs.length - currentWindowTabs.length; i++) {
      await chrome.tabs.create({ windowId: windowId })
    }
    currentWindowTabs = await actions.window.getTabs(windowId)
    setOpenTabs(currentWindowTabs)

    for (let i = 0; i < currentWindowTabs.length; i++) {
      chrome.tabs.update(currentWindowTabs[i].id, { url: tabs[i].url })
    }
  } else if (currentWindowTabs.length === tabs.length) {
    setOpenTabs(currentWindowTabs)
    for (let i = 0; i < currentWindowTabs.length; i++) {
      chrome.tabs.update(currentWindowTabs[i].id, { url: tabs[i].url })
    }
  }
}

export default update