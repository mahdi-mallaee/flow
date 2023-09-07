import openSession from "~actions/openSession"
import { type Session } from "~utils/types"
import refreshUnsavedWindows from "./refreshUnsavedWindows"
import refreshLastClosedWindow from "./refreshLastClosedWindow"
import refreshOpenSessions from "./refreshOpenSessions"
import Store from "~store"
import getTabsByWindowId from "./getTabsByWindowId"

/*
  it runs after windows.onCreated event when there is only on window. (the reason is in background script)
  first checks if the last closed window was main session, if it was, it assigns the windows id to the session.
  if the first condition wasn't satisfied it will check if there is a main session if that's the case main session
  will be opened and any other window will be closed.
  if there is not a main session but the last closed window was a session the id of the opened winodw will be assigned to the session. 
*/

const openFirstSession = async () => {
  const sessions: Session[] = await Store.sessions.getAll()
  const mainSession: Session = sessions.find(session => session.main === true)
  const lastClosedWindowId = await Store.lastClosedWindow.getId()
  const lastSession = sessions.find(session => session.windowId === lastClosedWindowId)

  if (mainSession && lastSession && mainSession.windowId === lastSession.windowId) {
    const windows = await chrome.windows.getAll()
    if (windows && windows.length === 1) {
      const windowTabs = await getTabsByWindowId(windows[0].id)
      /* 
      this condition below ensures that the opened window is same as the last closed window.
      sometime even though in browsers settings it is set to open the last window onStartup
      the OS (happend on Mac OS) doesn't let the browser to open the last closed window.
      */

      // TODO: making a more reliable check
      if (windowTabs.length === mainSession.tabs.length && windowTabs[0].url === mainSession.tabs[0].url) {
        await Store.sessions.changeWindowId(mainSession.id, windows[0].id)
        refresh()
      } else {
        await openMainSession(mainSession)
      }
    } else {
      refresh()
    }
  } else if (mainSession) {
    await openMainSession(mainSession)
  } else if (lastSession) {
    const windows = await chrome.windows.getAll()
    if (windows && windows.length === 1) {
      const windowTabs = await getTabsByWindowId(windows[0].id)
      if (windowTabs.length === lastSession.tabs.length && windowTabs[0].url === lastSession.tabs[0].url) {
        await Store.sessions.changeWindowId(lastSession.id, windows[0].id)
      }
      refresh()
    } else {
      refresh()
    }
  } else {
    refresh()
  }
}

const refresh = async () => {
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
  refresh()
}

export default openFirstSession