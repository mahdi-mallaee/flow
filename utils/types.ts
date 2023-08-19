export type Session = {
  id: string,
  windowId: number,
  tabs: Tab[],
  title: string,
  main: boolean,
  isOpen: boolean,
  colorCode: number
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

export enum StoreKeys {
  sessions = 'sessions',
  settings = 'settings',
  unsavedWindows = 'unsavedWindows',
  backups = 'backups',
  openedTabs = 'openedTabs',
  lastClosedWindowId = 'lastClosedWindowId',
  autoBackupIntervalId = 'autoBackupIntervalId',
  mainHeight = 'mainheight'
}