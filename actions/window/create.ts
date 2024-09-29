import actions from "~actions"
import store from "~store"
import { WINDOWID_NONE } from "~utils/constants"

/**
 * Creates a new browser window with the specified URLs.
 *
 * @param urls - An optional array of URLs to open in the new window. If `deleteNewTabsWhenOpeningSession` is true,
 * any URLs that match `NEW_TAB_URL` will be filtered out.
 * 
 * @returns The ID of the newly created window, or `WINDOWID_NONE` if the window could not be created.
 */
const create = async (urls?: string[]): Promise<number> => {
  const settings = await store.settings.getAll()
  let id: number = WINDOWID_NONE
  urls = urls || []

  const window = await chrome.windows.create({ state: settings.newSessionWindowState, url: urls })
  if (actions.window.checkId(window.id)) {
    id = window.id
  }

  const lastTabId = window.tabs[window.tabs.length - 1].id

  if (actions.window.checkId(window.id) && lastTabId && lastTabId > 0) {
    chrome.tabs.update(lastTabId, { active: true })
  }

  return id
}

export default create