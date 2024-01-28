import { Storage } from "@plasmohq/storage"
import { StoreKeys, type OpenedTab } from "~utils/types"

const setOpenedTabsStore = async (tabs: OpenedTab[]) => {
  const localStorage = new Storage({ area: 'local' })
  await localStorage.set(StoreKeys.openedTabs, tabs || [])
}

export default setOpenedTabsStore