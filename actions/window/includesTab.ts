import actions from "~actions"

/**
 * Checks if a given tab ID is included in the tabs of a specified window.
 * It is used to make sure that the content script that sent request to show the unsaved window alert is
 * in the currently unsaved window that was opened.
 *
 * @param windowId - The ID of the window to check.
 * @param tabId - The ID of the tab to check for.
 * @returns `true` if the tab is included in the window, `false` otherwise.
 */
const includesTab = async (windowId: number, tabId: number): Promise<boolean> => {
  const tabs = windowId ? await actions.window.getTabs(windowId) : []
  if (tabs) {
    const ids = tabs.map(tab => { return tab.id })
    if (ids.includes(tabId)) {
      return true
    }
  }
  return false
}

export default includesTab