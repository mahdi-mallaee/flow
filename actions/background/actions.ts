import createSession from "./createSessoin"
import rebuildContextMenus from "./rebuildContextMenus"
import showUnsavedAlert from "./showUnsavedAlert"

const backgroundActions = {
  createSession: createSession,
  rebuildContextMenus: rebuildContextMenus,
  showUnsavedAlert: showUnsavedAlert
}

export default backgroundActions