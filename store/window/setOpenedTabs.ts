import { localStore } from "~utils/storageManager"
import { StoreKeys, type OpenedTab } from "~utils/types"

const setOpenedTabs = async (tabs: OpenedTab[]) => {
  const localStorage = localStore
  if (tabs && tabs.length > 0) {
    await localStorage.set(StoreKeys.openedTabs, [...tabs])
  }
}

export default setOpenedTabs