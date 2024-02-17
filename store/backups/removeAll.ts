import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Backup } from "~utils/types"

const removeAll = async () => {
  const localStorage = new Storage({ area: 'local' })
  await localStorage.set(StoreKeys.backups, [])
}

export default removeAll