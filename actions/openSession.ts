import createNewWindow from "./createNewWindow";
import type { Session } from "~utils/types";
import getTabsByWindowId from "./getTabsByWindowId";
import { Storage } from '@plasmohq/storage'

const openSession = async (sessions: Session[], sessionId: string, removeHistory?: boolean): Promise<Session[]> => {
  const store = new Storage({ area: 'local' })
  const startTime = Date.now()
  const session = sessions.find(s => { return s.id === sessionId })
  const newWindowId = await createNewWindow(session.tabs.map(t => { return t.url }))
  const tabs = await getTabsByWindowId(newWindowId)
  const openedTabs = []
  tabs.forEach((tab, i) => {
    if (i < tabs.length - 1) {
      openedTabs.push({ id: tab.id, discarded: false })
    }
  })

  store.set('openedTabs', openedTabs)

  const groups = {}

  session.tabs.forEach(tab => {
    const key = tab.groupId.toString()
    if (tab.groupId > 0) {
      if (groups[key]) {
        groups[key].push(tabs[tab.index].id + 1)
      } else {
        groups[key] = [tabs[tab.index].id + 1]
      }
    }
  })

  Object.keys(groups).forEach(group => {
    const tabIds: number[] = groups[group]
    chrome.tabs.group({ tabIds: tabIds, createProperties: { windowId: newWindowId } })
      .then(() => {
        if (removeHistory) {
          chrome.history.deleteRange({ startTime, endTime: Date.now() })
        }
      })
  })

  const newSessions = sessions.map(s => {
    if (s.id === sessionId) {
      s.windowId = newWindowId
      s.tabs = tabs
      s.isOpen = true
    }
    return s
  })

  store.set('sessions', newSessions)

  const windowTabs = await chrome.tabs.query({ windowId: newWindowId })
  if (windowTabs && windowTabs[0] && windowTabs[0].id && windowTabs.length > 1) {
    chrome.tabs.remove(tabs[0].id)
  }

  if (removeHistory) {
    chrome.history.deleteRange({ startTime, endTime: Date.now() })
  }

  return newSessions
}

export default openSession