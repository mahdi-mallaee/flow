import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Backup } from "~utils/types"

const getAll = async () => {
  const localStorage = new Storage({ area: 'local' })
  const backups: Backup[] = await localStorage.get(StoreKeys.backups) || []
  return backups
}

export default getAll