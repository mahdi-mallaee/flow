import backupStore from "./backups/store"
import sessionsStore from "./sessions/store"
import windowsStore from "./window/store"
import settingsStore from "./settings/store"

const store = {
  sessions: sessionsStore,
  settings: settingsStore,
  backups: backupStore,
  windows: windowsStore
}

export default store
