import { Storage } from "@plasmohq/storage"
import { StoreKeys, type OpenedTab } from "~utils/types"

const getOpenedTabs = async (): Promise<OpenedTab[]> => {
  const store = new Storage({ area: 'local' })
  const openedTabs: OpenedTab[] = await store.get(StoreKeys.openedTabs) || []
  return openedTabs
}

export default getOpenedTabs