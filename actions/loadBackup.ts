import { Storage } from "@plasmohq/storage"
import type { Backup, Session, Settings } from "~utils/types"
import refreshOpenSessions from "./refreshOpenSessions"
import refreshUnsavedWindows from "./refreshUnsavedWindows"
import createNewBackup from "./createNewBackup"

const loadBackup = async (backupId: string, backups?: Backup[]) => {
  const store = new Storage({ area: 'local' })
  backups = backups || await store.get('backups')
  const sessions: Session[] = await store.get('sessions')
  const settings: Settings = await store.get('settings')
  const openSessions = sessions.filter(session => session.isOpen)

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

    await store.set('sessions', backup.sessions)
    refreshOpenSessions(backup.sessions)
    refreshUnsavedWindows(backup.sessions)
  }
}

export default loadBackup