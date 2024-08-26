export interface Session extends BasicSession, SessionOpenStatus, SessionTabsStore { }

export interface BasicSession {
  id: string,
  title: string,
  main: boolean,
  colorCode: number,
  groups: TabGroup[]
}

export interface SessionOpenStatus {
  isOpen: boolean,
  id: string,
  windowId: number,
  freeze: boolean
}
export interface SessionTabsStore {
  tabs: Tab[],
  id: string
}

export type Tab = {
  id: number,
  url: string,
  windowId: number,
  index: number,
  groupId: number,
  pinned: boolean
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
  autoBackupsInterval: BackupIntervalTime,
  createBackupBeforeSessionDelete: boolean,
  deleteNewTabsWhenOpeningSession: boolean,
  openSessionInCurrentWindow: boolean,
  showLargeSessionWarning: boolean,
  createSessionInCurrentWindow: boolean
}

export type BackupIntervalTime = '0' | '10' | '30' | '60' | '120'
export type WindowState = chrome.windows.windowStateEnum

export enum Theme {
  light = 'light',
  magicalPurple = 'magical-purple',
  dark = 'dark',
  deepBlue = 'deep-blue',
  osDefault = 'os-default',
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

export enum Message {
  alertReady = 'alert-ready',
  alertGo = 'alert-go',
  saveSession = 'save-session',
  success = 'success',
  error = 'error',
  openSession = 'open-session',
  createSession = "create-session"
}

export type BgGlobalVar = {
  refreshUnsavedWindows: boolean,
  closingWindow: {
    status: boolean,
    windowId: number
  }
}