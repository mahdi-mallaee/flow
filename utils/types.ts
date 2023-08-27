export interface Session extends BasicSession {
  windowId: number,
  tabs: Tab[],
  isOpen: boolean,
}

export interface BasicSession {
  id: string,
  title: string,
  main: boolean,
  colorCode: number
}

export interface WindowIdStore {
  windowId: number,
  sessionId: string
}
export interface OpenSessionStore {
  isOpen: boolean,
  sessionId: string
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

export type AlertMessage = {
  show: boolean,
  text: string,
  type: 'error' | 'warning' | 'info'
}

export type Settings = {
  theme: Theme,
  newSessionWindowState: WindowState,
  createWindowForNewSession: boolean,
  openingBlankWindowOnStratup: boolean,
  autoBackupsInterval: BackupIntervalTime,
  createBackupBeforeLoad: boolean,
  createBackupBeforeSessionDelete: boolean,
}

export type BackupIntervalTime = '0' | '10' | '30' | '60' | '120'
export type WindowState = chrome.windows.windowStateEnum

export enum Theme {
  light = 'light',
  dark = 'dark',
  osDefault = 'os-default'
}

export const DefaultSettings: Settings = {
  theme: Theme.light,
  createWindowForNewSession: true,
  newSessionWindowState: "normal",
  openingBlankWindowOnStratup: false,
  autoBackupsInterval: '30',
  createBackupBeforeLoad: false,
  createBackupBeforeSessionDelete: true,
}

export type MainContentState = "sessions" | 'settings' | 'backups'

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

export type BackupStatus = 'manual' | 'before loading backup' | 'before deleting session' | 'interval backups'

export enum SessionsKeys {
  basic = 'basicSessions',
  open = 'openSessions',
  windowId = 'sessionsWindowIds',
  tab = 'sessionsTabs'
}

export enum StoreKeys {
  sessionsStatusId = 'sessionsStatusId',
  settings = 'settings',
  unsavedWindows = 'unsavedWindows',
  backups = 'backups',
  openedTabs = 'openedTabs',
  lastClosedWindowId = 'lastClosedWindowId',
  autoBackupIntervalId = 'autoBackupIntervalId',
  mainHeight = 'mainheight'
}

export type UnsavedWindow = {
  id: number,
  tabsCount: number
}

export type OpenedTab = {
  id: number,
  discarded: boolean
}