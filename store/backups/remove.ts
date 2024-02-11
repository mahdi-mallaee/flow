import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Backup } from "~utils/types"

const remove = async (id: string) => {
  const localStorage = new Storage({ area: 'local' })
  let backups: Backup[] = await localStorage.get(StoreKeys.backups) || []
  const index = backups.findIndex(b => b.id === id)
  if (index >= 0) {
    backups.splice(index, 1)
    await localStorage.set(StoreKeys.backups, backups)
  }
}

export default remove