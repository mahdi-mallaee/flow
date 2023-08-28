import openSession from "~actions/openSession"
import { type Session, type Settings } from "~utils/types"
import refreshUnsavedWindows from "./refreshUnsavedWindows"
import refreshLastClosedWindow from "./refreshLastClosedWindow"
import refreshOpenSessions from "./refreshOpenSessions"
import Store from "~store"

const openFirstSession = async () => {
  const sessions: Session[] = await Store.sessions.getAll()
  const settings: Settings = await Store.settings.getAll()

  if (settings.openingBlankWindowOnStratup) {
    const windows = await chrome.windows.getAll()
    await chrome.windows.create({ state: settings.newSessionWindowState })
    await chrome.windows.remove(windows[0].id)
    return
  }

  const mainSession: Session = sessions.find(session => session.main === true)
  const lastClosedWindowId = await Store.lastClosedWindow.getId()
  const lastSession = sessions.find(session => session.windowId === lastClosedWindowId)

  if (mainSession && lastSession && mainSession.windowId === lastSession.windowId) {
    const windows = await chrome.windows.getAll()
    if (windows && windows.length === 1) {
      await Store.sessions.changeWindowId(mainSession.id, windows[0].id)
      refreshLastClosedWindow()
      refreshUnsavedWindows()
      refreshOpenSessions()
    }
  } else if (mainSession) {
    const newWindowId = await openSession(mainSession.id)
    const windows = await chrome.windows.getAll()
    windows.forEach(window => {
      if (window.id !== newWindowId) {
        chrome.windows.remove(window.id)
          .then(() => {
            refreshUnsavedWindows()
            refreshLastClosedWindow()
            refreshOpenSessions()
          })
      }
    })
  } else if (lastSession) {
    const windows = await chrome.windows.getAll()
    if (windows && windows.length === 1) {
      await Store.sessions.changeWindowId(lastSession.id, windows[0].id)
      await refreshLastClosedWindow()
      await refreshOpenSessions()
      await refreshUnsavedWindows()
    }
  }
}

export default openFirstSession