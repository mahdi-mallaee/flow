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
}

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
}

export type MainContentState = "sessions" | 'settings' | 'backups'

export type Backup = {
  id: string,
  title: string,
  sessions: Session[],
  date: string
}