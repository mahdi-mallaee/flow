import { Storage } from "@plasmohq/storage"
import { DefaultSettings, StoreKeys } from "~utils/types"

const resetAllSettings = async () => {
  const store = new Storage({ area: 'local' })
  await store.set(StoreKeys.settings, DefaultSettings)
}

export default resetAllSettings