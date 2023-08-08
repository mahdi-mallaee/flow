import { Storage } from "@plasmohq/storage"
import getUnsavedWindows from "../actions/getUnsavedWindows"
import type { Session } from "~utils/types"

const refreshUnsavedWindows = async (sessions?: Session[]) => {
  const store = new Storage({ area: 'local' })

  sessions = sessions || await store.get('sessions')
  const windows = await getUnsavedWindows(sessions)
  await store.set('unsaved-windows', windows)
}

export default refreshUnsavedWindows