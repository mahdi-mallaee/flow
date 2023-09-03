import { Storage } from "@plasmohq/storage"
import { StoreKeys } from "~utils/types"

const setLastClosedWindowId = async (id: number) => {
  const store = new Storage({ area: "local" })
  if (typeof id === 'number' && id >= 0) {
    await store.set(StoreKeys.lastClosedWindowId, id)
  }
}

export default setLastClosedWindowId