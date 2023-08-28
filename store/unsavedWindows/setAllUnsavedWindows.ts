import { Storage } from "@plasmohq/storage";
import { StoreKeys, type UnsavedWindow } from "~utils/types";

const setAllUnsavedWindows = async (windows: UnsavedWindow[]) => {
  const store = new Storage({ area: 'local' })
  if (windows) {
    await store.set(StoreKeys.unsavedWindows, windows)
  }
}

export default setAllUnsavedWindows