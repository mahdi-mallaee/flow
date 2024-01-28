import saveSessionsTabsStore from "./sessions/saveSessionsTabsStore"
import createNewSessionStore from "./sessions/createNewSessionStore"
import getAllSessionsStore from "./sessions/getAllSessionsStore"
import changeSessionOpenStatusStore from "./sessions/changeSessionOpenStatusStore"
import refreshSessionsStatusStore from "./sessions/refreshSessionsStatusStore"
import deleteSessionStore from "./sessions/deleteSessionStore"
import changeSessionWindowIdStore from "./sessions/changeSessionWindowIdStore"
import getSessionTabsStore from "./sessions/getSessionTabsStore"
import setThemeStore from "./settings/setThemeStore"
import getAllSettingsStore from "./settings/getAllSettingsStore"
import resetAllSettingsStore from "./settings/resetAllSettingsStore"
import setWindowStateStore from "./settings/setWindowStateStore"
import setCreateWindowForNewSessionStore from "./settings/setCreateWindowForNewSessionStore"
import setCreateBackupBeforeSessionDeleteStore from "./settings/setBackupCreationBeforeSessionDeleteStore"
import setBackupIntervalStore from "./settings/setBackupIntervalStore"
import setOpenedTabsStore from "./openedTabs/setOpenedTabsStore"
import getOpenedTabsStore from "./openedTabs/getOpenedTabsStore"
import setSessionAsMainStore from "./sessions/setSessionAsMainStore"
import editSessionTitleStore from "./sessions/editSessionTitleStore"
import createNewBackupStore from "./backups/createNewBackupStore"
import deleteBackupStore from "./backups/deleteBackupStore"
import setAllSessionsStore from "./sessions/setAllSessionsStore"
import loadBackupStore from "./backups/loadBackupStore"
import getAllSessionsOpenStatusStore from "./sessions/getAllSessionsOpenStatusStore"
import setAllUnsavedWindowsStore from "./unsavedWindows/setAllUnsavedWindowsStore"
import getLastClosedWindowIdStore from "./lastClosedWindow/getLastClosedWindowIdStore"
import setLastClosedWindowIdStore from "./lastClosedWindow/setLastClosedWindowIdStore"
import changeUnsavedWindowAlertStatusStore from "./unsavedWindows/setUnsavedWindowAlertStatusStore"
import getUnsavedWindowAlertStatusStore from "./unsavedWindows/getUnsavedWindowAlertStatusStore"

const store = {
  sessions: {
    saveTabs: saveSessionsTabsStore,
    getTabs: getSessionTabsStore,
    create: createNewSessionStore,
    getAll: getAllSessionsStore,
    changeOpenStatus: changeSessionOpenStatusStore,
    refreshStatus: refreshSessionsStatusStore,
    delete: deleteSessionStore,
    changeWindowId: changeSessionWindowIdStore,
    setAsMain: setSessionAsMainStore,
    editTitle: editSessionTitleStore,
    setAll: setAllSessionsStore,
    getAllOpenStatus: getAllSessionsOpenStatusStore
  },
  settings: {
    setTheme: setThemeStore,
    getAll: getAllSettingsStore,
    reset: resetAllSettingsStore,
    setWindowState: setWindowStateStore,
    setCreateWindowForNewSession: setCreateWindowForNewSessionStore,
    backups: {
      setInterval: setBackupIntervalStore,
      setCreateBeforeSessionDelete: setCreateBackupBeforeSessionDeleteStore,
    },
  },
  openedTabs: {
    set: setOpenedTabsStore,
    get: getOpenedTabsStore
  },
  backups: {
    create: createNewBackupStore,
    delete: deleteBackupStore,
    load: loadBackupStore
  },
  unsavedWindows: {
    setAll: setAllUnsavedWindowsStore,
    changeAlertStatus: changeUnsavedWindowAlertStatusStore,
    getAlertId: getUnsavedWindowAlertStatusStore
  },
  lastClosedWindow: {
    getId: getLastClosedWindowIdStore,
    setId: setLastClosedWindowIdStore,
  }
}

export default store
