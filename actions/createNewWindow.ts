import Store from "~store"

const createNewWindow = async (urls?: string[]): Promise<number> => {
  const settings = await Store.settings.getAll()
  let id: number = -1
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