import { type OpenedTab, type Tab, type TabGroup } from "~utils/types";
import store from "~store";
import actions from "~actions";

const openSession = async (sessionId: string): Promise<number> => {
  const startTime = Date.now()

  const tabs: Tab[] = await store.sessions.getTabs(sessionId)
  const newWindowId = await actions.window.create(tabs.map(t => { return t.url }))
  const windowTabs = await actions.window.getTabs(newWindowId)
  const groups = await store.sessions.getGroups(sessionId)

  await store.sessions.saveTabs(sessionId, windowTabs)
  await store.sessions.changeOpenStatus(sessionId, true)
  await store.sessions.changeWindowId(sessionId, newWindowId)

  setOpenTabs(windowTabs)
  await groupTabs(groups, tabs, windowTabs, newWindowId)
  chrome.history.deleteRange({ startTime, endTime: Date.now() })
  await actions.window.refreshUnsavedWindows()
  await actions.window.changeRecentWindowId(newWindowId)
  return newWindowId
}

const _groupTabs = async (tabs: Tab[], windowTabs: Tab[], newWindowId: number) => {
  const groups = {}
  tabs.forEach(tab => {
    const key = tab.groupId.toString()
    if (tab.groupId > 0) {
      if (groups[key]) {
        groups[key].push(windowTabs[tab.index].id)
      } else {
        groups[key] = [windowTabs[tab.index].id]
      }
    }
  })

  for (const group of Object.keys(groups)) {
    const tabIds: number[] = groups[group]
    try {
      await chrome.tabs.group({ tabIds: tabIds, createProperties: { windowId: newWindowId } })
    } catch (erorr) {
      console.log(erorr)
    }
  }
}

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

const setOpenTabs = (windowTabs: Tab[]) => {
  const openedTabs: OpenedTab[] = []
  windowTabs.forEach((tab, i) => {
    if (i < windowTabs.length - 1) {
      openedTabs.push({ id: tab.id, discarded: false })
    }
  })
  store.openedTabs.set(openedTabs)
}

export default openSession