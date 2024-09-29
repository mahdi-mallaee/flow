import { Storage } from "@plasmohq/storage"
import { StoreKeys, type OpenedTab } from "~utils/types"

const setOpenedTabs = async (tabs: OpenedTab[]) => {
  const localStorage = new Storage({ area: 'local' })
  if (tabs && tabs.length > 0) {
    await localStorage.set(StoreKeys.openedTabs, [...tabs])
  }

}

export default setOpenedTabs