import { type Session, type Tab } from "~utils/types"
import store from "~store"
import actions from "~actions"

const openFirstSession = async () => {
  const sessions = await store.sessions.getAll()
  const mainSession = sessions.find(session => session.main === true)
  const lastClosedWindowId = await store.windows.getLastClosedWindowId()
  const lastSession = sessions.find(session => session.windowId === lastClosedWindowId)

  if (mainSession && lastSession && mainSession.windowId === lastSession.windowId) {
    const windows = await chrome.windows.getAll()
    if (windows && windows.length === 1) {
      const windowTabs = await actions.window.getTabs(windows[0].id)

      if (compareTabs(windowTabs, mainSession.tabs)) {
        await store.sessions.setWindowId(mainSession.id, windows[0].id)
      } else {
        await openMainSession(mainSession)
      }
    }
  } else if (mainSession) {
    await openMainSession(mainSession)
  } else if (lastSession) {
    const windows = await chrome.windows.getAll()
    if (windows && windows.length === 1) {
      const windowTabs = await actions.window.getTabs(windows[0].id)
      if (compareTabs(windowTabs, lastSession.tabs)) {
        await store.sessions.setWindowId(lastSession.id, windows[0].id)
      }
    }
  }

  await actions.window.refreshLastClosedWindow()
  await actions.session.refreshOpenSessions()
  await actions.window.refreshUnsavedWindows()
}

const openMainSession = async (mainSession: Session) => {
  const newWindowId = (await actions.session.open(mainSession.id)).windowId
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
  let result = true
  if (windowTabs.length !== sessionTabs.length) {
    return false
  }

  for (let i = 0; i < windowTabs.length; i++) {
    if (windowTabs[i].url !== sessionTabs[i].url) {
      result = false
    }
  }

  return result
}

export default openFirstSession