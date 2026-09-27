import * as backupStore from "./backups/store";
import * as sessionsStore from "./sessions/store";
import * as windowsStore from "./window/store";
import * as settingsStore from "./settings/store";

const store = {
  sessions: sessionsStore,
  settings: settingsStore,
  backups: backupStore,
  windows: windowsStore
};

export default store;
