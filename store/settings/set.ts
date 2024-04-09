import { Storage } from "@plasmohq/storage"
import store from "~store"
import { StoreKeys, type Settings } from "~utils/types"

const set = async (newSettings: Partial<Settings>) => {
  const localStorage = new Storage({ area: "local" })
  const settings: Settings = await store.settings.getAll()
  const updatedSettings: Settings = { ...settings, ...newSettings }
  await localStorage.set(StoreKeys.settings, updatedSettings)
}

export default set
