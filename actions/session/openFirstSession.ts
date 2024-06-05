import { type Session, type Tab } from "~utils/types"
import store from "~store"
import actions from "~actions"

/**
 * Runs at the chrome startup and assigns the opened window to its corresponding session.
 * 
 * If there is a main session and the last closed window matches the main session's window,
 * it will assign them together.
 * 
 * If there is a main session and it was not the last closed window, it will open that session.
 */
const openFirstSession = async () => {
  const sessions = await store.sessions.getAll()
  const mainSession = sessions.find(session => session.main === true)
  const windows = await chrome.windows.getAll()

  if (mainSession) {
    if (windows && windows.length === 1) {
      const windowTabs = await actions.window.getTabs(windows[0].id)

      if (compareTabs(windowTabs, mainSession.tabs)) {
        await store.sessions.setWindowId(mainSession.id, windows[0].id)
      } else {
        await openMainSession(mainSession)
      }
    } else {
      await openMainSession(mainSession)
    }
  } else {
    if (windows) {
      let retry = true
      for (const window of windows) {
        const windowTabs = await actions.window.getTabs(window.id)
        for (const session of sessions) {
          if (compareTabs(windowTabs, session.tabs)) {
            retry = false
            await store.sessions.setWindowId(session.id, window.id)
          }
        }
      }

      if (retry) {
        setTimeout(openFirstSession, 300)
      }
    }
  }

  await actions.session.refreshOpenSessions()
  await actions.window.refreshUnsavedWindows()
}

const openMainSession = async (mainSession: Session) => {
  const newWindowId = await actions.session.open(mainSession.id)
  const windows = await chrome.windows.getAll()
  for (const window of windows) {
    if (window.id !== newWindowId) {
      await chrome.windows.remove(window.id)
    }
  }
}

/* 
This condition below ensures that the opened window is same as the last closed window.

Sometime even though in browsers settings it is set to open the last window onStartup
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