import { Theme, type Settings } from "./types"

export const DEFAULT_MAIN_CONTAINER_HEIGHT = 470
export const ALERT_MESSAGE_DURATION_MS = 4000
export const INPUT_MAX_LENGTH = 25
export const WINDOWID_NONE = -1
export const NEW_TAB_URL = "chrome://newtab/"
export const EMAIL = "flow.extension@gmail.com"

export const DEFAULT_SETTINGS: Settings = {
  theme: Theme.osDefault,
  createWindowForNewSession: true,
  newSessionWindowState: "normal",
  autoBackupsInterval: "30",
  createBackupBeforeSessionDelete: true,
  deleteNewTabsWhenOpeningSession: false
}