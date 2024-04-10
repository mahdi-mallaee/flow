import store from "~store"
import type { OpenedTab } from "~utils/types"

/**
 * Discards the tab with the provided ID from memory, if it exists and has not already been discarded.
 * This function run in the tabs.onUpdated event to ensure tab is loaded partially before deleting.
 * This helps to load sessions with a large number of tabs faster.
 * If the tab cannot be discarded due to an error, the error is logged.
 *
 * @param id - The ID of the tab to be discarded.
 * @returns Promise that resolves when the tab has been discarded or an error has occurred.
 */
const discardOpenedTab = async (id: number,) => {
  const openedTabs: OpenedTab[] = await store.windows.getOpenedTabs()
  if (openedTabs && openedTabs.length >= 1) {
    const tab = openedTabs.find(ot => ot.id === id)
    if (tab && id && !tab.discarded) {
      try {
        await chrome.tabs.discard(id)
      }
      catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error('ERROR: tab could not be discarde -> actoins/window/discardedOpenedTab', error)
        }
      }
      tab.discarded = true
    }
    await store.windows.setOpenedTabs(openedTabs)
  }
}

export default discardOpenedTab