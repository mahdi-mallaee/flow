import { Storage } from "@plasmohq/storage"
import { StoreKeys, type UnsavedWindow } from "~utils/types"

const isWindowUnsaved = async (windowId: number): Promise<boolean> => {
  const store = new Storage({ area: "local" })
  const unsavedWindows: UnsavedWindow[] = await store.get(StoreKeys.unsavedWindows) || []
  const index = unsavedWindows.findIndex(w => w.id === windowId)
  if (index >= 0) {
    return true
  }

  return false
}

export default isWindowUnsaved