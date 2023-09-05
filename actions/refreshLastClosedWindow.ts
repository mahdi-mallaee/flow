import Store from "~store"

const refreshLastClosedWindow = async () => {
  const windows = await chrome.windows.getAll()
  if (windows) {
    if (windows.length === 1) {
      await Store.lastClosedWindow.setId(windows[0].id)
    } else {
      await Store.lastClosedWindow.setId(-1)
    }
  }
}

export default refreshLastClosedWindow