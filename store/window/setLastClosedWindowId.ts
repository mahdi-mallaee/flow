import { Storage } from "@plasmohq/storage"
import actions from "~actions"
import { StoreKeys } from "~utils/types"

const setLastClosedWindowId = async (id: number) => {
  const localStorage = new Storage({ area: "local" })
  if (actions.window.checkId(id)) {
    await localStorage.set(StoreKeys.lastClosedWindowId, id)
  }
}

export default setLastClosedWindowId