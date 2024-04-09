import { Storage } from "@plasmohq/storage"
import { DEFAULT_SETTINGS } from "~utils/constants"
import { StoreKeys, type Settings } from "~utils/types"

const set = async (newSettings: Partial<Settings>) => {
  const localStorage = new Storage({ area: "local" })
  const settings: Settings = await localStorage.get(StoreKeys.settings) || DEFAULT_SETTINGS
  const updatedSettings: Settings = { ...settings, ...newSettings }
  await localStorage.set(StoreKeys.settings, updatedSettings)
}

export default set
