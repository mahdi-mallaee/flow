import actions from "~actions"
import store from "~store"
import { NEW_TAB_URL, WINDOWID_NONE } from "~utils/constants"

const create = async (urls?: string[]): Promise<number> => {
  const settings = await store.settings.getAll()
  let id: number = WINDOWID_NONE
  urls = urls || []

  if (settings.deleteNewTabsWhenOpeningSession) {
    urls = urls.filter(url => url !== NEW_TAB_URL)
  }

  const window = await chrome.windows.create({ state: settings.newSessionWindowState, url: urls })
  if (actions.window.checkId(window.id)) {
    id = window.id
  }

  const lastTabId = window.tabs[window.tabs.length - 1].index

  if (actions.window.checkId(window.id) && lastTabId && lastTabId > 0) {
    chrome.tabs.highlight({ tabs: lastTabId, windowId: window.id })
  }

  return id
}

export default create