import { BACKUP_NUMBER_LIMIT } from "~utils/constants"
import { localStore } from "~utils/storageManager"
import { StoreKeys, type Backup } from "~utils/types"
import logger from "~utils/logger"

const create = async (backup: Backup): Promise<boolean> => {
  try {
    const localStorage = localStore

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
    logger.error('ERROR: creating backup -> store/backups/create', error)
    return false
  }
}

export default create