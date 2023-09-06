import { Storage } from "@plasmohq/storage"
import { WINDOWID_NONE } from "~utils/constants"
import { StoreKeys } from "~utils/types"

const getLastClosedWindowIdStore = async (): Promise<number> => {
  const store = new Storage({ area: "local" })
  const id: number = await store.get(StoreKeys.lastClosedWindowId) || WINDOWID_NONE
  return id
}

export default getLastClosedWindowIdStore