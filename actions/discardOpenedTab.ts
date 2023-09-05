import Store from "~store"
import type { OpenedTab } from "~utils/types"

const discardOpenedTab = async (id: number,) => {
  const openedTabs: OpenedTab[] = await Store.openedTabs.get()
  if (openedTabs && openedTabs.length >= 1) {
    const tab = openedTabs.find(ot => ot.id === id)
    if (tab && id && !tab.discarded) {
      try {
        await chrome.tabs.discard(id)
      }
      catch (error) {
        console.log(error)
      }
      tab.discarded = true
    }
    await Store.openedTabs.set(openedTabs)
  }
}

export default discardOpenedTab