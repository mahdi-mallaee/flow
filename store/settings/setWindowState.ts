import { Storage } from "@plasmohq/storage";
import { StoreKeys, type Settings, type WindowState } from "~utils/types";

const setWindowState = async (windowState: WindowState) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings)
  const newSettings: Settings = { ...settings, newSessionWindowState: windowState }

  await store.set(StoreKeys.settings, newSettings)
}

export default setWindowState