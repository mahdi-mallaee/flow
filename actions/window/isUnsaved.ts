import { Storage } from "@plasmohq/storage"
import { StoreKeys, type UnsavedWindow } from "~utils/types"

/**
 * Checks if a window with the given ID is marked as unsaved in the local storage.
 *
 * @param windowId - The ID of the window to check for unsaved state.
 * @returns A Promise that resolves to `true` if the window is marked as unsaved, `false` otherwise.
 */
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