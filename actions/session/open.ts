import { type OpenedTab, type Tab, type TabGroup } from "~utils/types";
import store from "~store";
import actions from "~actions";

const open = async (sessionId: string): Promise<number> => {
  const startTime = Date.now()

  const sessionTabs: Tab[] = await store.sessions.getTabs(sessionId)
  const newWindowId = await actions.window.create(sessionTabs.map(t => { return t.url }))
  const windowTabs = await actions.window.getTabs(newWindowId)
  const groups = await store.sessions.getGroups(sessionId)

  await store.sessions.saveTabs(sessionId, windowTabs)
  await store.sessions.changeOpenStatus(sessionId, true)
  await store.sessions.changeWindowId(sessionId, newWindowId)

  setOpenTabs(windowTabs)
  await groupTabs(groups, sessionTabs, windowTabs, newWindowId)
  chrome.history.deleteRange({ startTime, endTime: Date.now() })
  await actions.window.refreshUnsavedWindows()
  await actions.window.changeRecentWindowId(newWindowId)
  return newWindowId
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

export default open