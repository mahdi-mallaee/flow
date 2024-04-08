import store from "~store"
import type { OpenedTab, Tab } from "~utils/types"

const setOpenTabs = async(windowTabs: Tab[]) => {
  const openedTabs: OpenedTab[] = []
  windowTabs.forEach((tab, i) => {
    if (i < windowTabs.length - 1) {
      openedTabs.push({ id: tab.id, discarded: false })
    }
  })
  await store.windows.setOpenedTabs(openedTabs)
}

export default setOpenTabs