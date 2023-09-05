import type { Backup, BackupIntervalTime, OpenedTab, Session, Settings, Tab, Theme, UnsavedWindow, WindowState } from "~utils/types"
import saveSessionsTabsStore from "./sessions/saveSessionsTabsStore"
import createNewSessionStore from "./sessions/createNewSessionStore"
import getAllSessionsStore from "./sessions/getAllSessionsStore"
import changeSessionOpenStatusStore from "./sessions/changeSessionOpenStatusStore"
import refreshSessionsStatusStore from "./sessions/refreshSessionsStatusStore"
import deleteSessionStore from "./sessions/deleteSessionStore"
import changeSessionWindowIdStore from "./sessions/changeSessionWindowIdStore"
import getSessionTabsStore from "./sessions/getSessionTabsStore"
import deleteAllSessionsStore from "./sessions/deleteAllSessionsStore"
import setThemeStore from "./settings/setThemeStore"
import getAllSettingsStore from "./settings/getAllSettingsStore"
import resetAllSettingsStore from "./settings/resetAllSettingsStore"
import setWindowStateStore from "./settings/setWindowStateStore"
import setCreateWindowForNewSessionStore.ts from "./settings/setCreateWindowForNewSessionStore"
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

const Store = {
  sessions: {
    async saveTabs(sessionId: string, tabs: Tab[]) { await saveSessionsTabsStore(sessionId, tabs) },
    async getTabs(sessionId: string): Promise<Tab[]> { return await getSessionTabsStore(sessionId) },
    async create(session: Session) { await createNewSessionStore(session) },
    async getAll(): Promise<Session[]> { return await getAllSessionsStore() },
    async changeOpenStatus(sessionId: string, isOpen: boolean) { await changeSessionOpenStatusStore(sessionId, isOpen) },
    async refreshStatus() { await refreshSessionsStatusStore() },
    async delete(sessionId: string) { await deleteSessionStore(sessionId) },
    async changeWindowId(sessionId: string, windowId: number) { await changeSessionWindowIdStore(sessionId, windowId) },
    async deleteAll() { await deleteAllSessionsStore() },
    async setAsMain(sessionId: string) { await setSessionAsMainStore(sessionId) },
    async editTitle(sessionId: string, title: string) { await editSessionTitleStore(sessionId, title) },
    async setAll(sessions: Session[]) { await setAllSessionsStore(sessions) },
    async getAllOpenStatus() { return await getAllSessionsOpenStatusStore() }
  },
  settings: {
    async setTheme(theme: Theme) { await setThemeStore(theme) },
    async getAll(): Promise<Settings> { return await getAllSettingsStore() },
    async reset() { await resetAllSettingsStore() },
    async setWindowState(windowState: WindowState) { await setWindowStateStore(windowState) },
    async setCreateWindowForNewSession(createWindow: boolean) { await setCreateWindowForNewSessionStore.ts(createWindow) },
    backups: {
      async setInterval(interval: BackupIntervalTime) { await setBackupIntervalStore(interval) },
      async setCreateBeforeSessionDelete(createBackup: boolean) { await setCreateBackupBeforeSessionDeleteStore(createBackup) },
    },
  },
  openedTabs: {
    async set(tabs: OpenedTab[]) { await setOpenedTabsStore(tabs) },
    async get() { return await getOpenedTabsStore() }
  },
  backups: {
    async create(backup: Backup) { await createNewBackupStore(backup) },
    async delete(id: string) { await deleteBackupStore(id) },
    async load(id: string) { await loadBackupStore(id) }
  },
  unsavedWindows: {
    async setAll(windows: UnsavedWindow[]) { await setAllUnsavedWindowsStore(windows) }
  },
  lastClosedWindow: {
    async getId() { return await getLastClosedWindowIdStore() },
    async setId(id: number) { await setLastClosedWindowIdStore(id) },
  }
}

export default Store
