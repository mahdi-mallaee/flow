import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Backup } from "~utils/types"

const createNewBackupStore = async (backup: Backup) => {
  const localStorage = new Storage({ area: 'local' })
  let backups: Backup[] = await localStorage.get(StoreKeys.backups) || []
  if (backup) {
    backups = [backup, ...backups]
    await localStorage.set(StoreKeys.backups, backups)
  }
}

export default createNewBackupStore