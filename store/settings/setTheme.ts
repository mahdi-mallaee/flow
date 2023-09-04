import { Storage } from "@plasmohq/storage";
import { StoreKeys, type Settings, type Theme, DefaultSettings } from "~utils/types";

const setTheme = async (theme: Theme) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings) || DefaultSettings
  const newSettings: Settings = { ...settings, theme }
  console.log(newSettings)

  await store.set(StoreKeys.settings, newSettings)
}

export default setTheme