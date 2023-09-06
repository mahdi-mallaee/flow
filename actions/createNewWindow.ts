import Store from "~store"
import { WINDOWID_NONE } from "~utils/constants"

const createNewWindow = async (urls?: string[]): Promise<number> => {
  const settings = await Store.settings.getAll()
  let id: number = WINDOWID_NONE
  const window = await chrome.windows.create({ state: settings.newSessionWindowState, url: urls })
  if (window.id) {
    id = window.id
  }

  const lastTabId = window.tabs[window.tabs.length - 1].index

  if (lastTabId && lastTabId > 0) {
    chrome.tabs.highlight({ tabs: lastTabId, windowId: window.id })
  }

  return id
}

export default createNewWindow