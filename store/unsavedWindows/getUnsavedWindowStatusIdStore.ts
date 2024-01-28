import { Storage } from "@plasmohq/storage"
import { StoreKeys, type unsavedWindowAlertStatusId } from "~utils/types"

const getUnsavedWindowStatusIdStore = async (): Promise<unsavedWindowAlertStatusId> => {
  const store = new Storage({ area: 'local' })
  const status: unsavedWindowAlertStatusId = await store.get(StoreKeys.unsavedWindowAlertStatusId) || { windowId: -1, alertShown: false }
  return status
}

export default getUnsavedWindowStatusIdStore