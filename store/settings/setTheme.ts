import { Storage } from "@plasmohq/storage";
import { StoreKeys, type Settings, type Theme } from "~utils/types";

const setTheme = async (theme: Theme) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings)
  const newSettings: Settings = { ...settings, theme }

  await store.set(StoreKeys.settings, newSettings)
}

export default setTheme