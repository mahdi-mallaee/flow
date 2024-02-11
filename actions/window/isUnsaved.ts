import { Storage } from "@plasmohq/storage"
import { StoreKeys, type UnsavedWindow } from "~utils/types"

const isUnsaved = async (windowId: number): Promise<boolean> => {
  const localStorage = new Storage({ area: "local" })
  const unsavedWindows: UnsavedWindow[] = await localStorage.get(StoreKeys.unsavedWindows) || []
  const index = unsavedWindows.findIndex(w => w.id === windowId)
  if (index >= 0) {
    return true
  }

  return false
}

export default isUnsaved