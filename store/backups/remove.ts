import { localStore } from "~utils/storageManager"
import { StoreKeys, type Backup } from "~utils/types"
import logger from "~utils/logger"

const remove = async (id: string): Promise<boolean> => {
  const localStorage = localStore
  let backups: Backup[] = await localStorage.get(StoreKeys.backups) || []
  const index = backups.findIndex(b => b.id === id)
  if (index >= 0) {
    backups.splice(index, 1)
    try {
      await localStorage.set(StoreKeys.backups, backups)
      return true
    } catch (error) {
      logger.error('ERROR: could not set the backups -> store/backups/remove', error)
      return false
    }
  } else {
    logger.error('ERROR: could not find the backup -> store/backups/remove')
    return false
  }
}

export default remove