import { Storage } from "@plasmohq/storage"
import refreshUnsavedWindows from "~actions/refreshUnsavedWindows"
import Store from "~store"
import { StoreKeys, type Backup } from "~utils/types"

const loadBackup = async (id: string) => {
  const store = new Storage({ area: 'local' })
  let backups: Backup[] = await store.get(StoreKeys.backups) || []
  const index = backups.findIndex(b => b.id === id)
  const backup = index >= 0 ? backups[index] : undefined

  if (backup && backup.sessions) {

    backup.sessions.forEach(session => {
      session.isOpen = false
      session.windowId = -1
    })
    await Store.sessions.setAll(backup.sessions)
    await refreshUnsavedWindows()
  }
}

export default loadBackup