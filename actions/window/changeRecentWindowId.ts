import actions from "~actions"
import store from "~store"

const changeRecentWindowId = async (windowId: number) => {
  const isUnsvaed = await actions.window.isUnsaved(windowId)
  if (isUnsvaed) {
    await store.unsavedWindows.changeAlertStatus(windowId, false)
  } else {
    await store.unsavedWindows.changeAlertStatus(-1, true)
  }
}

export default changeRecentWindowId