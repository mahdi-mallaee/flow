import { Storage } from "@plasmohq/storage"
import { v4 } from "uuid"
import { StoreKeys } from "~utils/types"

const refreshSessionsStatusStore = async () => {
  const store = new Storage({ area: 'local' })
  await store.set(StoreKeys.sessionsStatusId, v4())
}

export default refreshSessionsStatusStore