import openSession from "~actions/openSession"
import { type Session, type Tab } from "~utils/types"
import refreshUnsavedWindows from "./refreshUnsavedWindows"
import refreshLastClosedWindow from "./refreshLastClosedWindow"
import refreshOpenSessions from "./refreshOpenSessions"
import Store from "~store"
import getTabsByWindowId from "./getTabsByWindowId"

const openFirstSession = async () => {
  const sessions = await Store.sessions.getAll()
  const mainSession = sessions.find(session => session.main === true)
  const lastClosedWindowId = await Store.lastClosedWindow.getId()
  const lastSession = sessions.find(session => session.windowId === lastClosedWindowId)

  if (mainSession && lastSession && mainSession.windowId === lastSession.windowId) {
    const windows = await chrome.windows.getAll()
    if (windows && windows.length === 1) {
      const windowTabs = await getTabsByWindowId(windows[0].id)
      
      if (compareTabs(windowTabs, mainSession.tabs)) {
        await Store.sessions.changeWindowId(mainSession.id, windows[0].id)
      } else {
        await openMainSession(mainSession)
      }
    }
  } else if (mainSession) {
    await openMainSession(mainSession)
  } else if (lastSession) {
    const windows = await chrome.windows.getAll()
    if (windows && windows.length === 1) {
      const windowTabs = await getTabsByWindowId(windows[0].id)
      if (compareTabs(windowTabs, lastSession.tabs)) {
        await Store.sessions.changeWindowId(lastSession.id, windows[0].id)
      }
    }
  }
  
  await refreshLastClosedWindow()
  await refreshOpenSessions()
  await refreshUnsavedWindows()
}

const openMainSession = async (mainSession: Session) => {
  const newWindowId = await openSession(mainSession.id)
  const windows = await chrome.windows.getAll()
  for (const window of windows) {
    if (window.id !== newWindowId) {
      await chrome.windows.remove(window.id)
    }
  }
}

/* 
this condition below ensures that the opened window is same as the last closed window.

sometime even though in browsers settings it is set to open the last window onStartup
the OS (happend on Mac OS) doesn't let the browser to open the last closed window.
*/
const compareTabs = (windowTabs: Tab[], sessionTabs: Tab[]): boolean => {
  // TODO: making a more reliable check
  if (windowTabs.length !== sessionTabs.length) {
    return false
  }

  if (windowTabs[0].url !== sessionTabs[0].url) {
    return false
  }

  return true
}

export default openFirstSession