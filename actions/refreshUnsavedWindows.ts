import { Storage } from "@plasmohq/storage"
import getUnsavedWindows from "../actions/getUnsavedWindows"
import type { Session } from "~utils/types"

const refreshUnsavedWindows = async (sessions?: Session[]) => {
  const storage = new Storage({ area: 'local' })

  if (sessions) {
    const windows = await getUnsavedWindows(sessions)
    await storage.set('unsaved-windows', windows)
  } else {
    const sessions: Session[] = await storage.get('sessions')
    const windows = await getUnsavedWindows(sessions)
    await storage.set('unsaved-windows', windows)
  }
}

export default refreshUnsavedWindows