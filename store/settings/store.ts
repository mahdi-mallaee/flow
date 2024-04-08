import getAll from "./getAll"
import reset from "./reset"
import setBackupCreationBeforeSessionDelete from "./setBackupCreationBeforeSessionDelete"
import setBackupInterval from "./setBackupInterval"
import setCreateWindowForNewSession from "./setCreateWindowForNewSession"
import setDeleteNewTabsWhenOpeningSession from "./setDeleteNewTabsWhenOpeningSession"
import setOpenSessionInCurrentWindow from "./setOpenSessionInCurrentWindow"
import setTheme from "./setTheme"
import setWindowState from "./setWindowState"

const settingsStore = {
  setTheme,
  getAll,
  reset,
  setWindowState,
  setCreateWindowForNewSession,
  setDeleteNewTabsWhenOpeningSession,
  setBackupInterval,
  setBackupCreationBeforeSessionDelete,
  setOpenSessionInCurrentWindow,
}

export default settingsStore