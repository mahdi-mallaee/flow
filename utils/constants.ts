import { Theme, type Settings } from "./types"

export const DEFAULT_MAIN_CONTAINER_HEIGHT = 400
export const ALERT_MESSAGE_DURATION_MS = 3000
export const INPUT_MAX_LENGTH = 25
export const WINDOWID_NONE = -1

export const DEFAULT_SETTINGS: Settings = {
  theme: Theme.osDefault,
  createWindowForNewSession: true,
  newSessionWindowState: "normal",
  autoBackupsInterval: '30',
  createBackupBeforeSessionDelete: true,
}