import { DefaultAction, Theme, type Settings } from "./types"

export const DEFAULT_MAIN_CONTAINER_HEIGHT = 470
export const ALERT_MESSAGE_DURATION_MS = 4000
export const INPUT_MAX_LENGTH = 25
export const WINDOWID_NONE = -1
export const NEW_TAB_URL = "chrome://newtab/"
export const EMAIL = "flow.extension@gmail.com"
export const BACKUP_NUMBER_LIMIT = 50
export const SESSION_NUMBER_LIMIT = 25
export const LANDING_PAGE_URL = "https://flow-extension.pages.dev/"
export const UNINSTALL_URL = "https://forms.gle/XAJq2kmTpschA8Jn8"
export const NUMBER_OF_COLOR_CODES = 5

export const DEFAULT_SETTINGS: Settings = {
  theme: Theme.osDefault,
  newSessionWindowState: "normal",
  autoBackupsInterval: "30",
  createBackupBeforeSessionDelete: true,
  deleteNewTabsWhenOpeningSession: false,
  openSessionInCurrentWindow: false,
  showLargeSessionWarning: true,
  createSessionInCurrentWindow: false,
  defaultAction: DefaultAction.popup,
  saveWindowsPosition: false,
  clearHistoryAfterSessionOpening: false,
  showUnsavedWindowAlert: true
}