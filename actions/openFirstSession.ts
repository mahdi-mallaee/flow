import { Storage } from "@plasmohq/storage"
import openSession from "~actions/openSession"
import { StoreKeys, type Session, type Settings, DefaultSettings } from "~utils/types"
import refreshUnsavedWindows from "./refreshUnsavedWindows"
import refreshLastClosedWindow from "./refreshLastClosedWindow"
import refreshOpenSessions from "./refreshOpenSessions"
import Store from "~store"

const openFirstSession = async () => {
  const store = new Storage({ area: 'local' })
  const sessions: Session[] = await Store.sessions.getAll()
  const settings: Settings = await Store.settings.getAll()

  if (settings.openingBlankWindowOnStratup) {
    const windows = await chrome.windows.getAll()
    await chrome.windows.create({ state: settings.newSessionWindowState })
    await chrome.windows.remove(windows[0].id)
    return
  }

  const mainSession: Session = sessions.find(session => session.main === true)
  const lastClosedWindowId: number = await store.get(StoreKeys.lastClosedWindowId) || -1
  const lastSession = sessions.find(session => session.windowId === lastClosedWindowId)

  if (mainSession && lastSession && mainSession.windowId === lastSession.windowId) {
    const windows = await chrome.windows.getAll()
    if (windows && windows.length === 1) {
      const newSessions = sessions.map(session => {
        if (session.windowId === lastSession.windowId) {
          session.windowId = windows[0].id
        }
        return session
      })
      // await store.set(StoreKeys.sessions, newSessions)
      refreshLastClosedWindow()
      refreshUnsavedWindows(newSessions)
      refreshOpenSessions()
    }
  } else if (mainSession) {
    const newSessions = await openSession(mainSession.id)
    // await store.set(StoreKeys.sessions, newSessions)
    const windows = await chrome.windows.getAll()
    windows.forEach(window => {
      if (window.id !== mainSession.windowId) {
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
      const newSessions = sessions.map(session => {
        if (session.windowId === lastSession.windowId) {
          session.windowId = windows[0].id
        }
        return session
      })
      // await store.set(StoreKeys.sessions, newSessions)
      refreshLastClosedWindow()
      refreshUnsavedWindows(newSessions)
      refreshOpenSessions()
    }
  }
}

export default openFirstSession