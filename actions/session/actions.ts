import create from "./create";
import openFirstSession from "./openFirstSession";
import open from "./open";
import refreshOpenSessions from "./refreshOpenSessions";
import refreshTabs from "./refreshTabs";
import checkNumberLimit from "./checkNumberLimit";

const sessionActions = {
  create,
  open,
  refreshTabs,
  refreshOpenSessions,
  openFirstSession,
  checkNumberLimit
}

export default sessionActions