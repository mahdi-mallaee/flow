import { localStore } from "~utils/storageManager";
import { StoreKeys, type UnsavedWindow } from "~utils/types";

const getUnsavedWindows = async (): Promise<UnsavedWindow[]> => {
  const localStorage = localStore;
  const unsavedWindows: UnsavedWindow[] = await localStorage.get(StoreKeys.unsavedWindows) || [];
  return unsavedWindows;
};

export default getUnsavedWindows;

