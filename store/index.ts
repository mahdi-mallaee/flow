import type { BackupIntervalTime, OpenedTab, Session, Settings, Tab, Theme, WindowState } from "~utils/types"
import saveSessionsTabs from "./sessions/saveSessionsTabs"
import createNewSession from "./sessions/createNewSession"
import getAllSessions from "./sessions/getAllSessions"
import changeSessionOpenStatus from "./sessions/changeSessionOpenStatus"
import refreshSessionsStatus from "./sessions/refreshSessionsStatus"
import deleteSession from "./sessions/deleteSession"
import changeSessionWindowId from "./sessions/changeSessionWindowId"
import getSessionTabs from "./sessions/getSessionTabs"
import deleteAllSessions from "./sessions/deleteAllSessions"
import setTheme from "./settings/setTheme"
import getAllSettings from "./settings/getAllSettings"
import resetAllSettings from "./settings/resetAllSettings"
import setWindowState from "./settings/setWindowState"
import setCreateWindowForNewSession from "./settings/setCreateWindowForNewSession"
import setOpenBlankWindowOnStartup from "./settings/setOpenBlankWindowOnStartup"
import setCreateBackupBeforeSessionDelete from "./settings/setBackupCreationBeforeSessionDelete"
import setCreateBackupBeforeBackupLoad from "./settings/setCreateBackupBeforeBackupLoad"
import setBackupInterval from "./settings/setBackupInterval"
import setOpenedTabs from "./openedTabs/setOpenedTabs"
import getOpenedTabs from "./openedTabs/getOpenedTabs"

const Store = {
  sessions: {
    async saveTabs(sessionId: string, tabs: Tab[]) { await saveSessionsTabs(sessionId, tabs) },
    async getTabs(sessionId: string): Promise<Tab[]> { return await getSessionTabs(sessionId) },
    async create(session: Session) { await createNewSession(session) },
    async getAll(): Promise<Session[]> { return await getAllSessions() },
    async changeOpenStatus(sessionId: string, isOpen: boolean) { await changeSessionOpenStatus(sessionId, isOpen) },
    async refreshStatus() { await refreshSessionsStatus() },
    async delete(sessionId: string) { await deleteSession(sessionId) },
    async changeWindowId(sessionId: string, windowId: number) { await changeSessionWindowId(sessionId, windowId) },
    async deleteAll() { await deleteAllSessions() }
  },
  settings: {
    async setTheme(theme: Theme) { await setTheme(theme) },
    async getAll(): Promise<Settings> { return await getAllSettings() },
    async reset() { await resetAllSettings() },
    async setWindowState(windowState: WindowState) { await setWindowState(windowState) },
    async setCreateWindowForNewSession(createWindow: boolean) { await setCreateWindowForNewSession(createWindow) },
    async setOpenBlankWindowOnStartup(openWindow: boolean) { await setOpenBlankWindowOnStartup(openWindow) },
    backups: {
      async setInterval(interval: BackupIntervalTime) { await setBackupInterval(interval) },
      async setCreateBeforeSessionDelete(createBackup: boolean) { await setCreateBackupBeforeSessionDelete(createBackup) },
      async setCreateBeforeLoad(createBackup: boolean) { await setCreateBackupBeforeBackupLoad(createBackup) },
    },
  },
  openedTabs: {
    async set(tabs: OpenedTab[]) { setOpenedTabs(tabs) },
    async get() { return await getOpenedTabs() }
  }
}

export default Store
