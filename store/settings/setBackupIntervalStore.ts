import { Storage } from "@plasmohq/storage"
import { DEFAULT_SETTINGS } from "~utils/constants"
import { StoreKeys, type Settings, type BackupIntervalTime } from "~utils/types"

const setBackupIntervalStore = async (interval: BackupIntervalTime) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings) || DEFAULT_SETTINGS
  const newSettings: Settings = { ...settings, autoBackupsInterval: interval }
  await store.set(StoreKeys.settings, newSettings)
}

export default setBackupIntervalStore