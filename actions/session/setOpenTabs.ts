import store from "~store"
import type { OpenedTab, Tab } from "~utils/types"

const setOpenTabs = (windowTabs: Tab[], exludeTabId?: number) => {
  const openedTabs: OpenedTab[] = windowTabs.map((tab, i) => {
    return { id: tab.id, discarded: false }
  })

  if (exludeTabId) {
    openedTabs.find(ot => ot.id === exludeTabId)!.discarded = true
  } else {
    openedTabs[openedTabs.length - 1].discarded = true
  }
  store.windows.setOpenedTabs(openedTabs)
}

export default setOpenTabs