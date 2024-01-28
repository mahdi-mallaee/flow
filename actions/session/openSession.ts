import { type OpenedTab, type Tab } from "~utils/types";
import store from "~store";
import actions from "~actions";

const openSession = async (sessionId: string): Promise<number> => {
  const startTime = Date.now()

  const tabs: Tab[] = await store.sessions.getTabs(sessionId)
  const newWindowId = await actions.window.create(tabs.map(t => { return t.url }))
  const windowTabs = await actions.window.getTabs(newWindowId)

  await store.sessions.saveTabs(sessionId, windowTabs)
  await store.sessions.changeOpenStatus(sessionId, true)
  await store.sessions.changeWindowId(sessionId, newWindowId)

  setOpenTabs(windowTabs)
  await groupTabs(tabs, windowTabs, newWindowId, startTime)
  actions.window.refreshUnsavedWindows()
  chrome.history.deleteRange({ startTime, endTime: Date.now() })
  return newWindowId
}

const groupTabs = async (tabs: Tab[], windowTabs: Tab[], newWindowId: number, startTime: number) => {
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