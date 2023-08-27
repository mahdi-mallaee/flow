import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Backup } from "~utils/types"

const createNewBackup = async (backup: Backup) => {
  const store = new Storage({ area: 'local' })
  let backups: Backup[] = await store.get(StoreKeys.backups) || []
  if (backup) {
    backups = [backup, ...backups]
    await store.set(StoreKeys.backups, backups)
  }
}

export default createNewBackup