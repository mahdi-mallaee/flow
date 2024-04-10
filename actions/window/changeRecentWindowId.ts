import actions from "~actions"
import store from "~store"

/**
 * Changes the recent window ID and updates the unsaved window alert status accordingly.
 * It is used to show an alert indicating the window is not saved.
 * The alert is show in the content script.
 *
 * If the window with the given ID is unsaved, it sets the unsaved window alertShow for that window to false.
 * Otherwise, it will unset the window.
 *
 * @param windowId - The ID of the window to change the recent window ID for.
 */
const changeRecentWindowId = async (windowId: number) => {
  const isUnsvaed = await actions.window.isUnsaved(windowId)
  if (isUnsvaed) {
    await store.windows.setUnsavedWindowAlertStatus(windowId, false)
  } else {
    await store.windows.setUnsavedWindowAlertStatus(-1, true)
  }
}

export default changeRecentWindowId