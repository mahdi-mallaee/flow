import create from "./create";
import discardOpenedTab from "./discardOpenedTab";
import includesTab from "./includesTab";
import getGroups from "./getGroups";
import getTabs from "./getTabs";
import isUnsaved from "./isUnsaved";
import refreshUnsavedWindows from "./refreshUnsavedWindows";
import checkId from "./checkId";
import update from "./update";
import refreshWindowPositions from "~actions/session/refreshWindowPosition";
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
  getWindowPosBound,
  setBadgeColors,
}

export default windowActions