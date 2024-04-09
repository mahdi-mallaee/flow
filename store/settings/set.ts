import { Storage } from "@plasmohq/storage"
import store from "~store"
import { DEFAULT_SETTINGS } from "~utils/constants"
import { StoreKeys, type Settings } from "~utils/types"

const set = async (newSettings: Partial<Settings>): Promise<boolean> => {
  const localStorage = new Storage({ area: "local" })
  const settings: Settings = await store.settings.getAll()

  const updatedSettings: Settings = { ...settings, ...newSettings }

  const validKeys = Object.keys(DEFAULT_SETTINGS)
  if (!Object.keys(newSettings).every(key => validKeys.includes(key))) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR: provided keys are not included in the Settings type -> store/settings/set l.13')
    }
    return false
  }

  try {
    await localStorage.set(StoreKeys.settings, updatedSettings)
    return true

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR: could not set the settings -> store/settings/set l.18', error)
    }
    return false
  }
}

export default set
