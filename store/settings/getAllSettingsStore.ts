import { Storage } from "@plasmohq/storage";
import { DEFAULT_SETTINGS } from "~utils/constants";
import { StoreKeys, type Settings } from "~utils/types";

const getAllSettingsStore = async (): Promise<Settings> => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings) || DEFAULT_SETTINGS
  return settings
}

export default getAllSettingsStore