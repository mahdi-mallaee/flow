import create from "./create";
import discardOpenedTab from "./discardOpenedTab";
import includesTab from "./includesTab";
import getGroups from "./getGroups";
import getTabs from "./getTabs";
import isUnsaved from "./isUnsaved";
import refreshUnsavedWindows from "./refreshUnsavedWindows";
import checkId from "./checkId";
import update from "./update";
import refreshWindowPositions from "./refreshWindowPosition";
import setOpenTabs from "./setOpenTabs";
import groupTabs from "./groupTabs";
import getWindowPosBound from "./getWindowPosBound";
import setBadgeColors from "./setBadgeColor";

const windowActions = {
  create,
  discardOpenedTab,
  getTabs,
  getGroups,
  refreshUnsavedWindows,
  isUnsaved,
  includesTab,
  checkId,
  update,
  refreshWindowPositions,
  setOpenTabs,
  groupTabs,
  getWindowPosBound,
  setBadgeColors,
}

export default windowActions