import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Settings, type BackupIntervalTime, DefaultSettings } from "~utils/types"

const setBackupInterval = async (interval: BackupIntervalTime) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings) || DefaultSettings
  const newSettings: Settings = { ...settings, autoBackupsInterval: interval }
  await store.set(StoreKeys.settings, newSettings)
}

export default setBackupInterval