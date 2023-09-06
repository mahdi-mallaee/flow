import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { DEFAULT_SETTINGS } from "~utils/constants"
import { StoreKeys, type Settings } from "~utils/types"

const useSettings = () => {
  const [settings] = useStorage<Settings>({
    instance: new Storage({ area: 'local' }), key: StoreKeys.settings
  }, DEFAULT_SETTINGS)


  return settings
}

export default useSettings