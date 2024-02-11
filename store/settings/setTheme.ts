import { Storage } from "@plasmohq/storage";
import { DEFAULT_SETTINGS } from "~utils/constants";
import { StoreKeys, type Settings, type Theme } from "~utils/types";

const setTheme = async (theme: Theme) => {
  const localStorage = new Storage({ area: "local" })
  const settings: Settings = await localStorage.get(StoreKeys.settings) || DEFAULT_SETTINGS
  const newSettings: Settings = { ...settings, theme }

  await localStorage.set(StoreKeys.settings, newSettings)
}

export default setTheme