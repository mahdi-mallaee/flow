import { localStore } from "~utils/storageManager"
import { StoreKeys, type OpenedTab } from "~utils/types"

const getOpenedTabs = async (): Promise<OpenedTab[]> => {
  const localStorage = localStore
  const openedTabs: OpenedTab[] = await localStorage.get(StoreKeys.openedTabs) || []
  return openedTabs
}

export default getOpenedTabs