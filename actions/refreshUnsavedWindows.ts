import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Session, type UnsavedWindow } from "~utils/types"
import getUnsavedWindows from "./getUnsavedWindows"
import Store from "~store"

const refreshUnsavedWindows = async (sessions?: Session[]) => {
  const store = new Storage({ area: 'local' })

  sessions = await Store.sessions.getAll()
  const windows: UnsavedWindow[] = await getUnsavedWindows(sessions) || []
  await store.set(StoreKeys.unsavedWindows, windows)
}

export default refreshUnsavedWindows