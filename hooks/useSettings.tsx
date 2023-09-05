import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { StoreKeys, DefaultSettings, type Settings } from "~utils/types"

const useSettings = () => {
  const [settings] = useStorage<Settings>({
    instance: new Storage({ area: 'local' }), key: StoreKeys.settings
  }, DefaultSettings)


  return settings
}

export default useSettings