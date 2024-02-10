import { Storage } from "@plasmohq/storage";
import { DEFAULT_SETTINGS } from "~utils/constants";
import { StoreKeys, type Settings } from "~utils/types";

const setCreateWindowForNewSessionStore = async (createWindow: boolean) => {
  const localStorage = new Storage({ area: "local" })
  const settings: Settings = await localStorage.get(StoreKeys.settings) || DEFAULT_SETTINGS
  const newSettings: Settings = { ...settings, createWindowForNewSession: createWindow }
  await localStorage.set(StoreKeys.settings, newSettings)
}

export default setCreateWindowForNewSessionStore