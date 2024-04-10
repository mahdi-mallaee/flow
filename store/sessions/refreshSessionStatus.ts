import { Storage } from "@plasmohq/storage"
import { v4 } from "uuid"
import { StoreKeys } from "~utils/types"

/**
* Sessions are seperated in different parts and if anything changes this functino will becalled,
* indicating the sessions have changed so the UI gets the updated sessions
*/

const refreshSessionStatus = async () => {
  const localStorage = new Storage({ area: 'local' })
  await localStorage.set(StoreKeys.sessionsStatusId, v4())
}

export default refreshSessionStatus