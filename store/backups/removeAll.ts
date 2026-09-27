import { localStore } from "~utils/storageManager"
import { StoreKeys } from "~utils/types"

const removeAll = async () => {
  const localStorage = localStore
  await localStorage.set(StoreKeys.backups, [])
}

export default removeAll