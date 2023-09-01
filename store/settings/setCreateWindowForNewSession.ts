import { Storage } from "@plasmohq/storage";
import { StoreKeys, type Settings } from "~utils/types";

const setCreateWindowForNewSession = async (createWindow: boolean) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings)
  const newSettings: Settings = { ...settings, createWindowForNewSession: createWindow }
  await store.set(StoreKeys.settings, newSettings)
}

export default setCreateWindowForNewSession