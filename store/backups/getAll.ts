import { localStore } from "~utils/storageManager"
import { StoreKeys, type Backup } from "~utils/types"

const getAll = async () => {
  const localStorage = localStore
  const backups: Backup[] = await localStorage.get(StoreKeys.backups) || []
  return backups
}

export default getAll