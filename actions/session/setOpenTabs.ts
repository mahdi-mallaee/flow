import store from "~store"
import type { OpenedTab, Tab } from "~utils/types"

/**
 * Sets the recent opened tabs so they can be discarded in the background after they have their url.
 * Not discarding will result in the tabs taking a lot of time and resources to load.
 * And discarding so early will result in the tabs being blank new tab pages.
 *
 * @param windowTabs - The tabs that need to be discarded after opening a session.
 * @returns A promise that resolves when the open tabs have been set.
 */

const setOpenTabs = async(windowTabs: Tab[], exludeTabId?: number) => {
  const openedTabs: OpenedTab[] = windowTabs.map((tab, i) => {
    return { id: tab.id, discarded: false }
  })

  if (exludeTabId) {
    openedTabs.find(ot => ot.id === exludeTabId)!.discarded = true
  } else {
    openedTabs[openedTabs.length - 1].discarded = true
  }
  await store.windows.setOpenedTabs(openedTabs)
}

export default setOpenTabs