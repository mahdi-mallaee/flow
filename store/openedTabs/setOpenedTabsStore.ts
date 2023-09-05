import { Storage } from "@plasmohq/storage"
import { StoreKeys, type OpenedTab } from "~utils/types"

const setOpenedTabsStore = async (tabs: OpenedTab[]) => {
  const store = new Storage({ area: 'local' })
  await store.set(StoreKeys.openedTabs, tabs || [])
}

export default setOpenedTabsStore