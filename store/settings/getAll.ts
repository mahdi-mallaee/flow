import { Storage } from "@plasmohq/storage";
import { DEFAULT_SETTINGS } from "~utils/constants";
import { StoreKeys, type Settings } from "~utils/types";

const getAll = async (): Promise<Settings> => {
  const localStorage = new Storage({ area: "local" })
  const settings: Settings = await localStorage.get(StoreKeys.settings) || DEFAULT_SETTINGS
  Object.keys(DEFAULT_SETTINGS).forEach(key => {
    if (settings[key] === undefined) {
      settings[key] = DEFAULT_SETTINGS[key]
    }
  })
  return settings
}

export default getAll