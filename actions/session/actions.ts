import create from "./create";
import openFirstSession from "./openFirstSession";
import open from "./open";
import refreshOpenSessions from "./refreshOpenSessions";
import refreshTabs from "./refreshTabs";
import checkNumberLimit from "./checkNumberLimit";
import openSessionsPage from "./openSessionsPage";
import refreshGroups from "./refreshGroups";
import moveTabs from "./moveTabs";

const sessionActions = {
  create,
  open,
  refreshTabs,
  refreshOpenSessions,
  openFirstSession,
  checkNumberLimit,
  openSessionsPage,
  refreshGroups,
  moveTabs,
}

export default sessionActions