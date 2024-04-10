import { Storage } from "@plasmohq/storage";
import { DEFAULT_SETTINGS } from "~utils/constants";
import { StoreKeys, type Settings } from "~utils/types";

const getAll = async (): Promise<Settings> => {
  const localStorage = new Storage({ area: "local" })
  const settings: Settings = await localStorage.get(StoreKeys.settings) || DEFAULT_SETTINGS

  // checks to see if all the settings keys are getting retrieved or not and if not, it will set the default value
  // this is to prevent the app from breaking if the settings are not set in the local storage

  Object.keys(DEFAULT_SETTINGS).forEach(key => {
    if (settings[key] === undefined) {
      settings[key] = DEFAULT_SETTINGS[key]
    }
  })
  return settings
}

export default getAll