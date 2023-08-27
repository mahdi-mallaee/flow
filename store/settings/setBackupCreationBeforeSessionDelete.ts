import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Settings } from "~utils/types"

const setCreateBackupBeforeSessionDelete = async (createBackup: boolean) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings)
  const newSettings: Settings = { ...settings, createBackupBeforeSessionDelete: createBackup }
  await store.set(StoreKeys.settings, newSettings)
}

export default setCreateBackupBeforeSessionDelete