import alertGo from "./alertGo"
import createSession from "./createSessoin"
import rebuildContextMenus from "./rebuildContextMenus"
import saveSession from "./saveSession"

const backgroundActions = {
  alertGo: alertGo,
  saveSession: saveSession,
  createSession: createSession,
  rebuildContextMenus: rebuildContextMenus
}

export default backgroundActions