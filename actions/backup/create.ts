import { v4 as uuidv4 } from "uuid"
import store from "~store"
import { type Backup, type BackupStatus, type Session } from "~utils/types"

type backupInput = {
  status: BackupStatus,
  title?: string,
  relatedItem?: {
    title: string,
    type: 'session' | 'backup'
  },
  sessions?: Session[]
}

const create = async ({ status, title, relatedItem, sessions }: backupInput) => {
  sessions = sessions || await store.sessions.getAll()

  const newBackup: Backup = {
    id: uuidv4(),
    title: title || new Date().toLocaleString(),
    sessions,
    date: new Date().toLocaleString(),
    status,
    relatedItem
  }

  await store.backups.create(newBackup)

}

export default create