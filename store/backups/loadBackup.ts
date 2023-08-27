import { Storage } from "@plasmohq/storage"
import createNewBackup from "~actions/createNewBackup"
import Store from "~store"
import { StoreKeys, type Backup } from "~utils/types"

const loadBackup = async (id: string) => {

  //TODO: fixing open sessions
  {/*
  backup.sessions.forEach(backupSession => {
    const openSession = openSessions.find(s => s.id === backupSession.id)
    if (openSession) {
      backupSession.isOpen = true
      backupSession.windowId = openSession.windowId
    } else {
      backupSession.isOpen = false
    }
  })
  */}

  const store = new Storage({ area: 'local' })
  let backups: Backup[] = await store.get(StoreKeys.backups) || []
  const index = backups.findIndex(b => b.id === id)
  const settings = await Store.settings.getAll()

  if (index >= 0 && backups[index].sessions) {
    if (settings.createBackupBeforeLoad) {
      await createNewBackup({
        status: 'before loading backup',
        relatedItem: {
          title: backups[index].title,
          type: 'backup'
        }
      })
    }
    await Store.sessions.setAll(backups[index].sessions)
  }
}

export default loadBackup