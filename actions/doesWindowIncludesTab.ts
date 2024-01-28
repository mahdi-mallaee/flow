import getTabsByWindowId from "./getTabsByWindowId"

const doesWindowIncludesTab = async (windowId: number, tabId: number): Promise<boolean> => {
  const tabs = windowId ? await getTabsByWindowId(windowId) : []
  if (tabs) {
    const ids = tabs.map(tab => { return tab.id })
    if (ids.includes(tabId)) {
      return true
    }
  }
  return false
}

export default doesWindowIncludesTab