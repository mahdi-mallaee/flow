import getOpenedTabs from "./getOpenedTabs"
import getUnsavedWindowAlertStatus from "./getUnsavedWindowAlertStatus"
import setUnsavedWindows from "./setUnsavedWindows"
import setOpenedTabs from "./setOpenedTabs"
import setUnsavedWindowAlertStatus from "./setUnsavedWindowAlertStatus"

const windowsStore = {
  setOpenedTabs,
  getOpenedTabs,
  setUnsavedWindows,
  setUnsavedWindowAlertStatus,
  getUnsavedWindowAlertStatus,
}

export default windowsStore