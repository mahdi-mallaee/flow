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
  create: create,
  discardOpenedTab: discardOpenedTab,
  getTabs: getTabs,
  getGroups: getGroups,
  refreshUnsavedWindows: refreshUnsavedWindows,
  isUnsaved: isUnsaved,
  includesTab: includesTab,
  checkId: checkId,
  update: update,
  refreshWindowPositions: refreshWindowPositions,
  getWindowPosBound: getWindowPosBound,
  setBadgeColors: setBadgeColors,
}

export default windowActions