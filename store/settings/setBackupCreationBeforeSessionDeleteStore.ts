import { Storage } from "@plasmohq/storage"
import { DEFAULT_SETTINGS } from "~utils/constants"
import { StoreKeys, type Settings } from "~utils/types"

const setCreateBackupBeforeSessionDeleteStore = async (createBackup: boolean) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings) || DEFAULT_SETTINGS
  const newSettings: Settings = { ...settings, createBackupBeforeSessionDelete: createBackup }
  await store.set(StoreKeys.settings, newSettings)
}

export default setCreateBackupBeforeSessionDeleteStore