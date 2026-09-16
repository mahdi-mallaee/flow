import { localStore } from "~utils/storageManager"
import { v4 } from "uuid"
import { StoreKeys } from "~utils/types"

/**
* Sessions are separated into different parts; whenever anything changes this function is called,
* indicating the sessions have changed so the UI gets the updated sessions
*/
const refreshSessionStatus = async () => {
  const localStorage = localStore
  await localStorage.set(StoreKeys.sessionsStatusId, v4())
}

export default refreshSessionStatus