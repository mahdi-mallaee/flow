import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Backup, type Session, type Settings, DefaultSettings } from "~utils/types"
import createNewBackup from "./createNewBackup"
import Store from "~store"

const loadBackup = async (backupId: string, backups?: Backup[]) => {
  const store = new Storage({ area: 'local' })
  backups = backups || await store.get(StoreKeys.backups) || []
  const sessions: Session[] = await Store.sessions.getAll()
  const settings: Settings = await store.get(StoreKeys.settings) || DefaultSettings
  const openSessions = sessions.filter(session => session.isOpen) || []

  const backup = backups.find(backup => backup.id === backupId)

  if (backup) {

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
      const openSession = openSessions.find(s => s.id === backupSession.id)
      if (openSession) {
        backupSession.isOpen = true
        backupSession.windowId = openSession.windowId
      } else {
        backupSession.isOpen = false
      }
    })

  }
}

export default loadBackup