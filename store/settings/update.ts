import store from "~store"
import { DEFAULT_SETTINGS } from "~utils/constants"
import { localStore } from "~utils/storageManager"
import { StoreKeys, type Settings } from "~utils/types"
import logger from "~utils/logger"

const update = async (): Promise<boolean> => {
  const localStorage = localStore
  const settings: Settings = await store.settings.getAll()

  const validKeys = Object.keys(DEFAULT_SETTINGS)

  validKeys.forEach(key => {
    if (settings[key] === undefined) {
      settings[key] = DEFAULT_SETTINGS[key]
    }
  })

  try {
    await localStorage.set(StoreKeys.settings, settings)
    return true
  } catch (error) {
    logger.error('ERROR: could not set the settings -> store/settings/update', error)
    return false
  }
}

export default update
