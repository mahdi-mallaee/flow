import createNewWindow from "./createNewWindow";
import { type OpenedTab, type Tab } from "~utils/types";
import getTabsByWindowId from "./getTabsByWindowId";
import Store from "~store";
import refreshUnsavedWindows from "./refreshUnsavedWindows";

const openSession = async (sessionId: string): Promise<number> => {
  const startTime = Date.now()

  let tabs: Tab[] = await Store.sessions.getTabs(sessionId)
  const newWindowId = await createNewWindow(tabs.map(t => { return t.url }))
  tabs = await getTabsByWindowId(newWindowId)

  await Store.sessions.saveTabs(sessionId, tabs)
  await Store.sessions.changeOpenStatus(sessionId, true)
  await Store.sessions.changeWindowId(sessionId, newWindowId)

  const openedTabs: OpenedTab[] = []
  tabs.forEach((tab, i) => {
    if (i < tabs.length - 1) {
      openedTabs.push({ id: tab.id, discarded: false })
    }
  })
  Store.openedTabs.set(openedTabs)

  //TODO: extraction part below to new action (createSessionGroups) or a new function in this file
  const groups = {}
  tabs.forEach(tab => {
    const key = tab.groupId.toString()
    if (tab.groupId > 0) {
      if (groups[key]) {
        groups[key].push(tabs[tab.index].id)
      } else {
        groups[key] = [tabs[tab.index].id]
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

  refreshUnsavedWindows()

  return newWindowId
}

export default openSession