import { Storage } from "@plasmohq/storage";
import { StoreKeys, type Settings, DefaultSettings } from "~utils/types";

const getAllSettingsStore = async (): Promise<Settings> => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings) || DefaultSettings
  return settings
}

export default getAllSettingsStore