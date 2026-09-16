import store from "~store"
import { DEFAULT_SETTINGS } from "~utils/constants"
import { localStore } from "~utils/storageManager"
import { StoreKeys, type Settings } from "~utils/types"
import logger from "~utils/logger"

const set = async (newSettings: Partial<Settings>): Promise<boolean> => {
  const validKeys = Object.keys(DEFAULT_SETTINGS)
  if (!Object.keys(newSettings).every(key => validKeys.includes(key))) {
    logger.error('ERROR: provided keys are not included in the Settings type -> store/settings/set')
    return false
  }

  const localStorage = localStore
  const settings: Settings = await store.settings.getAll()
  const updatedSettings: Settings = { ...settings, ...newSettings }

  try {
    await localStorage.set(StoreKeys.settings, updatedSettings)
    return true
  } catch (error) {
    logger.error('ERROR: could not set the settings -> store/settings/set', error)
    return false
  }
}

export default set
