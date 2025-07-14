import alertGo from "./alertGo"
import createSession from "./createSessoin"
import rebuildContextMenus from "./rebuildContextMenus"
import saveSession from "./saveSession"
import showUnsavedAlert from "./showUnsavedAlert"

const backgroundActions = {
  alertGo: alertGo,
  saveSession: saveSession,
  createSession: createSession,
  rebuildContextMenus: rebuildContextMenus,
  showUnsavedAlert: showUnsavedAlert
}

export default backgroundActions