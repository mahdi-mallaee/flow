import { Storage } from "@plasmohq/storage"
import { v4 } from "uuid"
import { StoreKeys } from "~utils/types"

const refreshSessionsStatusStore = async () => {
  const localStorage = new Storage({ area: 'local' })
  await localStorage.set(StoreKeys.sessionsStatusId, v4())
}

export default refreshSessionsStatusStore