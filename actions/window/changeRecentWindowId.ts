import actions from "~actions"
import store from "~store"

const changeRecentWindowId = async (windowId: number) => {
  const isUnsvaed = await actions.window.isUnsaved(windowId)
  if (isUnsvaed) {
    await store.windows.setUnsavedWindowAlertStatus(windowId, false)
  } else {
    await store.windows.setUnsavedWindowAlertStatus(-1, true)
  }
}

export default changeRecentWindowId