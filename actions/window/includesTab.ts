import actions from "~actions"

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