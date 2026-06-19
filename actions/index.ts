import * as backgroundActions from "./background/actions";
import * as backupActions from "./backup/actions";
import * as messageActions from "./message/actions";
import * as sessionActions from "./session/actions";
import * as windowActions from "./window/actions";

const actions = {
  backup: backupActions,
  session: sessionActions,
  window: windowActions,
  message: messageActions,
  background: backgroundActions,
};
export default actions;