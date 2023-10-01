import createNewWindow from "./createNewWindow";
import { type OpenedTab, type Tab } from "~utils/types";
import getTabsByWindowId from "./getTabsByWindowId";
import Store from "~store";
import refreshUnsavedWindows from "./refreshUnsavedWindows";

const openSession = async (sessionId: string): Promise<number> => {
  const startTime = Date.now()

  const tabs: Tab[] = await Store.sessions.getTabs(sessionId)
  const newWindowId = await createNewWindow(tabs.map(t => { return t.url }))
  const windowTabs = await getTabsByWindowId(newWindowId)

  await Store.sessions.saveTabs(sessionId, windowTabs)
  await Store.sessions.changeOpenStatus(sessionId, true)
  await Store.sessions.changeWindowId(sessionId, newWindowId)

  const openedTabs: OpenedTab[] = []
  windowTabs.forEach((tab, i) => {
    if (i < windowTabs.length - 1) {
      openedTabs.push({ id: tab.id, discarded: false })
    }
  })
  Store.openedTabs.set(openedTabs)

  groupTabs(tabs, windowTabs, newWindowId, startTime)
  refreshUnsavedWindows()
  return newWindowId
}

const groupTabs = (tabs: Tab[], windowTabs: Tab[], newWindowId: number, startTime: number) => {
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

  Object.keys(groups).forEach(group => {
    const tabIds: number[] = groups[group]
    chrome.tabs.group({ tabIds: tabIds, createProperties: { windowId: newWindowId } })
      .then(() => {
        chrome.history.deleteRange({ startTime, endTime: Date.now() })
      })
  })
}

export default openSession