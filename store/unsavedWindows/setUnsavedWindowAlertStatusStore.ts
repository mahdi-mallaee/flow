import { Storage } from "@plasmohq/storage"
import { StoreKeys, type unsavedWindowAlertStatus } from "~utils/types"

const changeUnsavedWindowAlertStatusStore = async (windowId: number, alertShown: boolean) => {
  const localStorage = new Storage({ area: 'local' })
  const alertStatus: unsavedWindowAlertStatus = { windowId, alertShown }
  await localStorage.set(StoreKeys.unsavedWindowAlertStatus, alertStatus)
}

export default changeUnsavedWindowAlertStatusStore