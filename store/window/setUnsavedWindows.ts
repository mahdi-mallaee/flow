import { localStore } from "~utils/storageManager";
import { StoreKeys, type UnsavedWindow } from "~utils/types";

const setUnsavedWindows = async (windows: UnsavedWindow[]) => {
  const localStorage = localStore
  if (windows) {
    await localStorage.set(StoreKeys.unsavedWindows, windows)
  }
}

export default setUnsavedWindows