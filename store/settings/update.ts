import { Storage } from "@plasmohq/storage"
import store from "~store"
import { DEFAULT_SETTINGS } from "~utils/constants"
import { StoreKeys, type Settings } from "~utils/types"

const update = async (): Promise<boolean> => {
  const localStorage = new Storage({ area: "local" })
  const settings: Settings = await store.settings.getAll()

  const validKeys = Object.keys(DEFAULT_SETTINGS)

  validKeys.forEach(key => {
    if (!Object.keys(settings).includes(key)) {
      settings[key] = DEFAULT_SETTINGS[key]
    }
  })

  try {
    await localStorage.set(StoreKeys.settings, settings)
    return true

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR: could not set the settings -> store/settings/set l.18', error)
    }
    return false
  }
}

export default update
