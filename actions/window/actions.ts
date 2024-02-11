import changeRecentWindowId from "./changeRecentWindowId";
import create from "./create";
import discardOpenedTab from "./discardOpenedTab";
import includesTab from "./includesTab";
import getGroups from "./getGroups";
import getTabs from "./getTabs";
import isUnsaved from "./isUnsaved";
import refreshLastClosedWindow from "./refreshLastClosedWindow";
import refreshUnsavedWindows from "./refreshUnsavedWindows";
import checkId from "./checkId";

const windowActions = {
  create,
  discardOpenedTab,
  getTabs,
  getGroups,
  refreshUnsavedWindows,
  isUnsaved,
  refreshLastClosedWindow,
  includesTab,
  changeRecentWindowId,
  checkId,
}

export default windowActions