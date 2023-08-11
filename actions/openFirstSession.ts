import { Storage } from "@plasmohq/storage"
import openSession from "~actions/openSession"
import type { Session, Settings } from "~utils/types"
import refreshUnsavedWindows from "./refreshUnsavedWindows"
import refreshLastClosedWindow from "./refreshLastClosedWindow"
import refreshOpenSessions from "./refreshOpenSessions"

const openFirstSession = async () => {
  const store = new Storage({ area: 'local' })
  const sessions: Session[] = await store.get('sessions')
  const settings: Settings = await store.get('settings')

  if (settings.openingBlankWindowOnStratup) {
    console.log('blank window')
    const windows = await chrome.windows.getAll()
    await chrome.windows.create({ state: settings.newSessionWindowState })
    await chrome.windows.remove(windows[0].id)
    return
  }


  const mainSession: Session = sessions.find(session => session.main === true)
  const lastClosedWindowId: number = await store.get('lastClosedWindowId')
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
      await store.set('sessions', newSessions)
      refreshLastClosedWindow()
      refreshUnsavedWindows(newSessions)
      refreshOpenSessions(newSessions)
    }
  } else if (mainSession) {
    const newSessions = await openSession(sessions, mainSession.id, true)
    await store.set('sessions', newSessions)
    const windows = await chrome.windows.getAll()
    windows.forEach(window => {
      if (window.id !== mainSession.windowId) {
        chrome.windows.remove(window.id)
          .then(() => {
            console.log(newSessions)
            refreshUnsavedWindows(newSessions)
            refreshLastClosedWindow()
            refreshOpenSessions(newSessions)
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
      await store.set('sessions', newSessions)
      refreshLastClosedWindow()
      refreshUnsavedWindows(newSessions)
      refreshOpenSessions(newSessions)
    }
  }
}

export default openFirstSession