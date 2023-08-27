import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Backup } from "~utils/types"

const deleteBackup = async (id: string) => {
  const store = new Storage({ area: 'local' })
  let backups: Backup[] = await store.get(StoreKeys.backups) || []
  const index = backups.findIndex(b => b.id === id)
  if (index >= 0) {
    backups.splice(index, 1)
    await store.set(StoreKeys.backups, backups)
  }
}

export default deleteBackup