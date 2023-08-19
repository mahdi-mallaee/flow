import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Session } from "~utils/types"

const refreshUnsavedWindows = async (sessions?: Session[]) => {
  const store = new Storage({ area: 'local' })

  sessions = sessions || await store.get(StoreKeys.sessions)
  const windows = await getUnsavedWindows(sessions)
  await store.set(StoreKeys.unsavedWindows, windows)
}

const getUnsavedWindows = async (sessions: Session[]): Promise<chrome.windows.Window[]> => {
  let unsavevdWindows = []
  const windows = await chrome.windows.getAll()
  windows.forEach(window => {
    const index = sessions.findIndex(session => { return session.windowId === window.id })
    if (index === -1) {
      unsavevdWindows.push(window)
    }
  })
  return unsavevdWindows
}

export default refreshUnsavedWindows