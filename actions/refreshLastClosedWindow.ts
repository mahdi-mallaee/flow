import { Storage } from "@plasmohq/storage"
import { StoreKeys } from "~utils/types"

const refreshLastClosedWindow = async () => {
  const store = new Storage({ area: 'local' })

  const windows = await chrome.windows.getAll()
  if (windows) {
    if (windows.length === 1) {
      store.set(StoreKeys.lastClosedWindowId, windows[0].id)
    } else {
      store.remove(StoreKeys.lastClosedWindowId)
    }
  }
}

export default refreshLastClosedWindow