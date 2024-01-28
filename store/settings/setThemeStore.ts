import { Storage } from "@plasmohq/storage";
import { DEFAULT_SETTINGS } from "~utils/constants";
import { StoreKeys, type Settings, type Theme } from "~utils/types";

const setThemeStore = async (theme: Theme) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings) || DEFAULT_SETTINGS
  const newSettings: Settings = { ...settings, theme }

  await store.set(StoreKeys.settings, newSettings)
}

export default setThemeStore