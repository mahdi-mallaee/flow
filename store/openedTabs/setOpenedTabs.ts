import { Storage } from "@plasmohq/storage"
import { StoreKeys, type OpenedTab } from "~utils/types"

const setOpenedTabs = async (tabs: OpenedTab[]) => {
  const store = new Storage({ area: 'local' })
  await store.set(StoreKeys.openedTabs, tabs || [])
}

export default setOpenedTabs