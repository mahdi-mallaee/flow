import { Storage } from "@plasmohq/storage"
import createNewBackup from "~actions/createNewBackup"
import refreshUnsavedWindows from "~actions/refreshUnsavedWindows"
import Store from "~store"
import { StoreKeys, type Backup } from "~utils/types"

const loadBackup = async (id: string) => {

  const store = new Storage({ area: 'local' })
  let backups: Backup[] = await store.get(StoreKeys.backups) || []
  const index = backups.findIndex(b => b.id === id)
  const settings = await Store.settings.getAll()
  const backup = index >= 0 ? backups[index] : undefined

  if (backup && backup.sessions) {
    if (settings.createBackupBeforeLoad) {
      await createNewBackup({
        status: 'before loading backup',
        relatedItem: {
          title: backup.title,
          type: 'backup'
        }
      })
    }
    backup.sessions.forEach(session => {
      session.isOpen = false
      session.windowId = -1
    })
    await Store.sessions.setAll(backup.sessions)
    await refreshUnsavedWindows()
  }
}

export default loadBackup