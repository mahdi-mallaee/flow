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

const create = async ({ status, title, relatedItem, sessions }: backupInput): Promise<boolean> => {
  sessions = sessions || await store.sessions.getAll()

  const newBackup: Backup = {
    id: uuidv4(),
    title: title || new Date().toLocaleString(),
    sessions: sessions || [],
    date: new Date().toLocaleString(),
    status: status || 'manual',
    relatedItem
  }

  const result = await store.backups.create(newBackup)
  return result

}

export default create