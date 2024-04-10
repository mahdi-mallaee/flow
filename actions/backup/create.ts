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

/**
 * Creates a new backup with the provided input parameters.
 *
 * @param status - The status of the backup.
 * @param title - The title of the backup. If not provided, the current date and time will be used.
 * @param relatedItem - An object containing the title and type of an item related to the backup.
 * @param sessions - The sessions that will be included in the backup.
 * @returns A boolean indicating whether the backup was successfully created.
 */
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