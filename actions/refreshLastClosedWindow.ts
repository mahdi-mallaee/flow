import Store from "~store"
import { WINDOWID_NONE } from "~utils/constants"

const refreshLastClosedWindow = async () => {
  const windows = await chrome.windows.getAll()
  if (windows) {
    if (windows.length === 1) {
      await Store.lastClosedWindow.setId(windows[0].id)
    } else {
      await Store.lastClosedWindow.setId(WINDOWID_NONE)
    }
  }
}

export default refreshLastClosedWindow