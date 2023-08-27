import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Settings } from "~utils/types"

const setCreateBackupBeforeBackupLoad = async (createBackup: boolean) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings)
  const newSettings: Settings = { ...settings, createBackupBeforeLoad: createBackup }
  await store.set(StoreKeys.settings, newSettings)
}

export default setCreateBackupBeforeBackupLoad