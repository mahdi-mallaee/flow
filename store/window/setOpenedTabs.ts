import { Storage } from "@plasmohq/storage"
import { StoreKeys, type OpenedTab } from "~utils/types"

const setOpenedTabs = async (tabs: OpenedTab[]) => {
  const localStorage = new Storage({ area: 'local' })
  await localStorage.set(StoreKeys.openedTabs, [...tabs] || [])
  console.log("tabs", tabs)
  const ot = await localStorage.get(StoreKeys.openedTabs)
  console.log('opened tabs', ot)
}

export default setOpenedTabs