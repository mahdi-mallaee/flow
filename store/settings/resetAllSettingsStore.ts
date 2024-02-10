import { Storage } from "@plasmohq/storage"
import { DEFAULT_SETTINGS } from "~utils/constants"
import { StoreKeys } from "~utils/types"

const resetAllSettingsStore = async () => {
  const localStorage = new Storage({ area: 'local' })
  await localStorage.set(StoreKeys.settings, DEFAULT_SETTINGS)
}

export default resetAllSettingsStore