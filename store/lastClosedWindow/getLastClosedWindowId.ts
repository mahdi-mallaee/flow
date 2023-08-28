import { Storage } from "@plasmohq/storage"
import { StoreKeys } from "~utils/types"

const getLastClosedWindowId = async (): Promise<number> => {
  const store = new Storage({ area: "local" })
  const id: number = await store.get(StoreKeys.lastClosedWindowId) || -1
  return id
}

export default getLastClosedWindowId