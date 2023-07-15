import { Storage } from "@plasmohq/storage"
import openSession from "~actions/openSession"
import type { Session } from "~utils/types"
import refreshUnsavedWindows from "./refreshUnsavedWindows"
import refreshLastClosedWindow from "./refreshLastClosedWindow"

const openMainSession = async () => {
  const storage = new Storage({ area: 'local' })

  const sessions: Session[] = await storage.get('sessions')
  const mainSession: Session = sessions.find(session => session.main === true)
  const lastClosedWindowId: number = await storage.get('lastClosedWindowId')
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
      await storage.set('sessions', newSessions)
      refreshLastClosedWindow()
      refreshUnsavedWindows()
    }
  } else if (mainSession) {
    const newSessions = await openSession(sessions, mainSession.id)
    storage.set('sessions', newSessions)
      .then(() => {
        chrome.windows.getAll()
          .then(windows => {
            windows.forEach(window => {
              if (window.id !== mainSession.windowId) {
                chrome.windows.remove(window.id)
                  .then(() => {
                    refreshUnsavedWindows()
                    refreshLastClosedWindow()
                  })
              }
            })
          })
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
      await storage.set('sessions', newSessions)
      refreshLastClosedWindow()
      refreshUnsavedWindows()
    }
  }
}

export default openMainSession