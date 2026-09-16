import { useStorage } from "@plasmohq/storage/hook"
import { DEFAULT_SETTINGS } from "~utils/constants"
import { localStore } from "~utils/storageManager"
import { StoreKeys, type Settings } from "~utils/types"

const useSettings = () => {
  const [settings] = useStorage<Settings>({
    instance: localStore,
    key: StoreKeys.settings
  }, DEFAULT_SETTINGS)

  return settings
}

export default useSettings