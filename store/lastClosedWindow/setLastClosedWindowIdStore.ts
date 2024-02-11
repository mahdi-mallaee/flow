import { Storage } from "@plasmohq/storage"
import windowIdCheck from "~actions/checkWindowId"
import { StoreKeys } from "~utils/types"

const setLastClosedWindowIdStore = async (id: number) => {
  const localStorage = new Storage({ area: "local" })
  if (windowIdCheck(id)) {
    await localStorage.set(StoreKeys.lastClosedWindowId, id)
  }
}

export default setLastClosedWindowIdStore