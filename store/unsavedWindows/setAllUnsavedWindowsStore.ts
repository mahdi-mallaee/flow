import { Storage } from "@plasmohq/storage";
import { StoreKeys, type UnsavedWindow } from "~utils/types";

const setAllUnsavedWindowsStore = async (windows: UnsavedWindow[]) => {
  const localStorage = new Storage({ area: 'local' })
  if (windows) {
    await localStorage.set(StoreKeys.unsavedWindows, windows)
  }
}

export default setAllUnsavedWindowsStore