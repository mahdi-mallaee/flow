import { Storage } from "@plasmohq/storage"
import { StoreKeys, type unsavedWindowAlertStatus } from "~utils/types"

const getUnsavedWindowAlertStatus = async (): Promise<unsavedWindowAlertStatus> => {
  const localStorage = new Storage({ area: 'local' })
  const status: unsavedWindowAlertStatus = await localStorage.get(StoreKeys.unsavedWindowAlertStatus) || { windowId: -1, alertShown: false }
  return status
}

export default getUnsavedWindowAlertStatus