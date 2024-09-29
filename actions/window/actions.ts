import changeRecentWindowId from "./changeRecentWindowId";
import create from "./create";
import discardOpenedTab from "./discardOpenedTab";
import includesTab from "./includesTab";
import getGroups from "./getGroups";
import getTabs from "./getTabs";
import isUnsaved from "./isUnsaved";
import refreshUnsavedWindows from "./refreshUnsavedWindows";
import checkId from "./checkId";
import update from "./update";

const windowActions = {
  create: create,
  discardOpenedTab: discardOpenedTab,
  getTabs: getTabs,
  getGroups: getGroups,
  refreshUnsavedWindows: refreshUnsavedWindows,
  isUnsaved: isUnsaved,
  includesTab: includesTab,
  changeRecentWindowId: changeRecentWindowId,
  checkId: checkId,
  update: update,
}

export default windowActions