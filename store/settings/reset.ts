import { DEFAULT_SETTINGS } from "~utils/constants"
import { localStore } from "~utils/storageManager"
import { StoreKeys } from "~utils/types"

const reset = async () => {
  const localStorage = localStore
  await localStorage.set(StoreKeys.settings, DEFAULT_SETTINGS)
}

export default reset