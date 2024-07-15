import actions from "~actions"
import store from "~store"
import type { BgGlobalVar, UnsavedWindow } from "~utils/types"

/**
* Refreshes the tabs for all open sessions and updates the unsaved window information.
*
* This function first retrieves the open sessions and their associated tabs.
*
* Next, the function refreshes the unsaved window information by calling `actions.window.refreshUnsavedWindows()`.
* For each unsaved window, it retrieves the tabs and updates the `tabsCount` property of the `UnsavedWindow` object.
*
* Finally, the function updates the `unsavedWindows` state in the store.
* 
* Saving tabs individualy by their event made a lot of problems so I just refresh them all after every event.
*
* @returns {Promise<void>}
*/

const refreshTabs = async (gl: BgGlobalVar): Promise<void> => {
  const sessions = await store.sessions.getOpenStatus()

  for (const session of sessions) {
    if (session.isOpen) {
      const tabs = await actions.window.getTabs(session.windowId)
      if (tabs && tabs.length > 0) {
        await store.sessions.setTabs(session.sessionId, tabs)
      }
    }
  }

  if (gl.refreshUnsavedWindows) {
    const unsavedWindows: UnsavedWindow[] = await actions.window.refreshUnsavedWindows(true)
    for (const window of unsavedWindows) {
      const tabs = await actions.window.getTabs(window.id)
      if (tabs && tabs.length > 0) {
        window.tabsCount = tabs.length
      }
    }

    await store.windows.setUnsavedWindows(unsavedWindows)
  }
}

export default refreshTabs