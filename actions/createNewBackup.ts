import { v4 as uuidv4 } from "uuid"
import Store from "~store"
import { type Backup, type BackupStatus, type Session } from "~utils/types"

type NewBackupInput = {
  status: BackupStatus,
  title?: string,
  relatedItem?: {
    title: string,
    type: 'session' | 'backup'
  },
  sessions?: Session[]
}

const createNewBackup = async ({ status, title, relatedItem, sessions }: NewBackupInput) => {
  sessions = sessions || await Store.sessions.getAll()

  const newBackup: Backup = {
    id: uuidv4(),
    title: title || new Date().toLocaleString(),
    sessions,
    date: new Date().toLocaleString(),
    status,
    relatedItem
  }

  await Store.backups.create(newBackup)

}

export default createNewBackup