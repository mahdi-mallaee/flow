import { Storage } from "@plasmohq/storage";
import { StoreKeys, type Settings, DefaultSettings } from "~utils/types";

const setCreateWindowForNewSessionStore = async (createWindow: boolean) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings) || DefaultSettings
  const newSettings: Settings = { ...settings, createWindowForNewSession: createWindow }
  await store.set(StoreKeys.settings, newSettings)
}

export default setCreateWindowForNewSessionStore