import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Session, type UnsavedWindow } from "~utils/types"
import getUnsavedWindows from "./getUnsavedWindows"

const refreshUnsavedWindows = async (sessions?: Session[]) => {
  const store = new Storage({ area: 'local' })

  sessions = sessions || await store.get(StoreKeys.sessions) || []
  const windows: UnsavedWindow[] = await getUnsavedWindows(sessions) || []
  await store.set(StoreKeys.unsavedWindows, windows)
}

export default refreshUnsavedWindows