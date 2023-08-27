import { Storage } from "@plasmohq/storage"
import { v4 as uuidv4 } from "uuid"
import Store from "~store"
import { StoreKeys, type Backup, type BackupStatus, type Session } from "~utils/types"

type NewBackupInput = {
  status: BackupStatus,
  title?: string,
  sessions?: Session[],
  backups?: Backup[],
  relatedItem?: {
    title: string,
    type: 'session' | 'backup'
  }
}

const createNewBackup = async (inputs: NewBackupInput): Promise<Backup[]> => {
  const store = new Storage({ area: 'local' })
  let { status, title, relatedItem, sessions, backups } = inputs

  backups = backups || await store.get(StoreKeys.backups) || []
  sessions = await Store.sessions.getAll()

  const newBackup: Backup = {
    id: uuidv4(),
    title: title || new Date().toLocaleString(),
    sessions,
    date: new Date().toLocaleString(),
    status,
    relatedItem
  }

  const newBackups: Backup[] = [newBackup, ...backups]

  await store.set(StoreKeys.backups, newBackups)

  return newBackups
}

export default createNewBackup