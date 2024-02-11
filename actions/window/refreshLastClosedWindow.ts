import store from "~store"
import { WINDOWID_NONE } from "~utils/constants"

/*
  it runs in windows.onRemoved event and checks if there is only one window open or not
  then saves it so when browser is being opened openFirstSession action would detect if
  the last closed window was a session or not
*/

const refreshLastClosedWindow = async () => {
  const windows = await chrome.windows.getAll()
  if (windows) {
    if (windows.length === 1) {
      await store.windows.setLastClosedWindowId(windows[0].id)
    } else {
      await store.windows.setLastClosedWindowId(WINDOWID_NONE)
    }
  }
}

export default refreshLastClosedWindow