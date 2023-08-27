import { Storage } from "@plasmohq/storage";
import { StoreKeys, type Settings } from "~utils/types";

const setOpenBlankWindowOnStartup = async (openWindow: boolean) => {
  const store = new Storage({ area: "local" })
  const settings: Settings = await store.get(StoreKeys.settings)
  const newSettings: Settings = { ...settings, openingBlankWindowOnStratup: openWindow }
  await store.set(StoreKeys.settings, newSettings)
}

export default setOpenBlankWindowOnStartup