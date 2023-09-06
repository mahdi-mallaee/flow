import { Storage } from "@plasmohq/storage"
import { DEFAULT_SETTINGS } from "~utils/constants"
import { StoreKeys } from "~utils/types"

const resetAllSettingsStore = async () => {
  const store = new Storage({ area: 'local' })
  await store.set(StoreKeys.settings, DEFAULT_SETTINGS)
}

export default resetAllSettingsStore