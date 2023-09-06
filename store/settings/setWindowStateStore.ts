import { Storage } from "@plasmohq/storage";
import { DEFAULT_SETTINGS } from "~utils/constants";
import { StoreKeys, type Settings, type WindowState } from "~utils/types";

const setWindowStateStore = async (windowState: WindowState) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings) || DEFAULT_SETTINGS
  const newSettings: Settings = { ...settings, newSessionWindowState: windowState }

  await store.set(StoreKeys.settings, newSettings)
}

export default setWindowStateStore