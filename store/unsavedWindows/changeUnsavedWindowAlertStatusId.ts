import { Storage } from "@plasmohq/storage"
import { v4 } from "uuid"
import { StoreKeys, type unsavedWindowAlertStatusId } from "~utils/types"

const changeUnsavedWindowStatusIdStore = async (windowId: number, alertShown: boolean) => {
  const store = new Storage({ area: 'local' })
  const alertStatus: unsavedWindowAlertStatusId = { windowId, alertShown }
  await store.set(StoreKeys.unsavedWindowAlertStatusId, alertStatus)
}

export default changeUnsavedWindowStatusIdStore