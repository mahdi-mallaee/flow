import backupActions from "./backup/actions"
import sessionActions from "./session/actions"
import windowActions from "./window/actions"

const actions = {
  backup: backupActions,
  session: sessionActions,
  window: windowActions
}
export default actions