import { Storage } from "@plasmohq/storage"
import Store from "~store"
import { SessionsKeys } from "~utils/types"

const deleteAllSessions = async () => {
  const store = new Storage({ area: 'local' })
  await store.set(SessionsKeys.basic, [])
  await store.set(SessionsKeys.open, [])
  await store.set(SessionsKeys.tab, [])
  await store.set(SessionsKeys.windowId, [])
  await Store.sessions.refreshStatus()
}

export default deleteAllSessions