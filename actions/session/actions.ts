import create from "./create";
import openFirstSession from "./openFirstSession";
import open from "./open";
import refreshOpenSessions from "./refreshOpenSessions";
import refreshTabs from "./refreshTabs";
import checkNumberLimit from "./checkNumberLimit";
import openSessionsPage from "./openSessionsPage";
import refreshGroups from "./refreshGroups";

const sessionActions = {
  create: create,
  open: open,
  refreshTabs: refreshTabs,
  refreshOpenSessions: refreshOpenSessions,
  openFirstSession: openFirstSession,
  checkNumberLimit: checkNumberLimit,
  openSessionsPage: openSessionsPage,
  refreshGroups: refreshGroups
}

export default sessionActions