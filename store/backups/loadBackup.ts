import { Storage } from "@plasmohq/storage"
import createNewBackup from "~actions/createNewBackup"
import Store from "~store"
import { StoreKeys, type Backup } from "~utils/types"

const loadBackup = async (id: string) => {

  const store = new Storage({ area: 'local' })
  let backups: Backup[] = await store.get(StoreKeys.backups) || []
  const index = backups.findIndex(b => b.id === id)
  const settings = await Store.settings.getAll()
  const openSessions = await Store.sessions.getAllOpenStatus()
  console.log(openSessions)

  if (index >= 0 && backups[index].sessions) {
    const backup = backups[index]
    if (settings.createBackupBeforeLoad) {
      await createNewBackup({
        status: 'before loading backup',
        relatedItem: {
          title: backup.title,
          type: 'backup'
        }
      })
    }
    backup.sessions.forEach(backupSession => {
      const openSession = openSessions.find(s => s.sessionId === backupSession.id)
      if (openSession && openSession.isOpen === true) {
        backupSession.isOpen = true
        backupSession.windowId = openSession.windowId
      } else {
        backupSession.isOpen = false
      }
    })
    await Store.sessions.setAll(backups[index].sessions)
  }
}

export default loadBackup