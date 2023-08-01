import { Storage } from "@plasmohq/storage"
import type { Session } from "~utils/types"

const refreshOpenSessions = async (sessions?: Session[]) => {
  const store = new Storage({ area: 'local' })

  sessions = sessions || await store.get('sessions')
  const windows = await chrome.windows.getAll()

  sessions.forEach(session => {
    const index = windows.findIndex(window => window.id === session.windowId)
    if (index >= 0) {
      session.isOpen = true
    } else {
      session.isOpen = false
    }
  })

  await store.set('sessions', sessions)

}

export default refreshOpenSessions