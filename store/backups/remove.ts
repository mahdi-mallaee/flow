import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Backup } from "~utils/types"

const remove = async (id: string): Promise<boolean> => {
  const localStorage = new Storage({ area: 'local' })
  let backups: Backup[] = await localStorage.get(StoreKeys.backups) || []
  const index = backups.findIndex(b => b.id === id)
  if (index >= 0) {
    backups.splice(index, 1)
    try {
      await localStorage.set(StoreKeys.backups, backups)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('ERROR: could not set the backups -> store/backup/remove l.18')
      }
      return false
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR: could not find the backup -> store/backup/remove l.10 ')
    }
    return false
  }
}

export default remove