import getLastClosedWindowId from "./getLastClosedWindowId"
import getOpenedTabs from "./getOpenedTabs"
import getUnsavedWindowAlertStatus from "./getUnsavedWindowAlertStatus"
import setUnsavedWindows from "./setUnsavedWindows"
import setLastClosedWindowId from "./setLastClosedWindowId"
import setOpenedTabs from "./setOpenedTabs"
import setUnsavedWindowAlertStatus from "./setUnsavedWindowAlertStatus"

const windowsStore = {
  setOpenedTabs,
  getOpenedTabs,
  setUnsavedWindows,
  setUnsavedWindowAlertStatus,
  getUnsavedWindowAlertStatus,
  getLastClosedWindowId,
  setLastClosedWindowId,
}

export default windowsStore