import { Storage } from "@plasmohq/storage"
import { BACKUP_NUMBER_LIMIT } from "~utils/constants"
import { StoreKeys, type Backup } from "~utils/types"

const create = async (backup: Backup): Promise<boolean> => {
  try {
    const localStorage = new Storage({ area: 'local' })

    let backups: Backup[] = await localStorage.get(StoreKeys.backups) || []

    if (backup) {
      if (backups.length >= BACKUP_NUMBER_LIMIT) {
        backups.pop()
      }
      
      backups = [backup, ...backups]
      await localStorage.set(StoreKeys.backups, backups)
    }

    return true

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR: creating backup -> store/backup/create l.7', error)
    }

    return false
  }
}

export default create