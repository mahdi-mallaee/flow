import store from "~store"

/**
 * Refreshes the last closed window ID in the application store.
 * 
 * This function is called when a window is removed (closed) and checks if there is only one window open.
 * If there is only one window open, it saves the ID of that window in the application store.
 * This information is used by the `openFirstSession` action to detect if the last closed window was a session.
 */
const refreshLastClosedWindow = async () => {
  const windows = await chrome.windows.getAll()
  if (windows && windows.length === 1) {
    await store.windows.setLastClosedWindowId(windows[0].id)
  }
}

export default refreshLastClosedWindow