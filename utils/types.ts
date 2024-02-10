export interface Session extends BasicSession {
  windowId: number,
  tabs: Tab[],
  isOpen: boolean,
}

export interface BasicSession {
  id: string,
  title: string,
  main: boolean,
  colorCode: number,
  groups: TabGroup[]
}

export interface SessionOpenStatus {
  isOpen: boolean,
  sessionId: string,
  windowId: number
}
export interface SessionTabsStore {
  tabs: Tab[],
  sessionId: string
}

export type Tab = {
  id: number,
  url: string,
  windowId: number,
  index: number,
  groupId: number,
}

export type TabGroup = {
  id: number,
  title: string,
  color: chrome.tabGroups.ColorEnum,
  collapsed: boolean
}

export type AlertMessage = {
  text: string,
  type: 'error' | 'warning' | 'info'
}

export type Settings = {
  theme: Theme,
  newSessionWindowState: WindowState,
  createWindowForNewSession: boolean,
  autoBackupsInterval: BackupIntervalTime,
  createBackupBeforeSessionDelete: boolean,
}

export type BackupIntervalTime = '0' | '10' | '30' | '60' | '120'
export type WindowState = chrome.windows.windowStateEnum

export enum Theme {
  light = 'light',
  dark = 'dark',
  osDefault = 'os-default'
}

export type Path = "/" | '/settings' | '/backups'

export type Backup = {
  id: string,
  title: string,
  sessions: Session[],
  date: string,
  status: BackupStatus
  relatedItem?: {
    title: string,
    type: 'session' | 'backup'
  }
}

export type BackupStatus = 'manual' | 'before loading backup' | 'before deleting session' | 'interval backups' | 'upload'

export enum SessionsKeys {
  basic = 'basicSessions',
  open = 'openSessions',
  tab = 'sessionsTabs'
}

export enum StoreKeys {
  sessionsStatusId = 'sessionsStatusId',
  unsavedWindowAlertStatus = 'unsavedWindowAlertStatus',
  settings = 'settings',
  unsavedWindows = 'unsavedWindows',
  backups = 'backups',
  openedTabs = 'openedTabs',
  lastClosedWindowId = 'lastClosedWindowId',
  autoBackupIntervalId = 'autoBackupIntervalId',
  mainHeight = 'mainheight'
}

export type unsavedWindowAlertStatus = {
  windowId: number,
  alertShown: boolean
}

export type UnsavedWindow = {
  id: number,
  tabsCount: number
}

export type OpenedTab = {
  id: number,
  discarded: boolean
}