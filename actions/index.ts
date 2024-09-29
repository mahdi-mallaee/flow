import backgroundActions from "./background/actions"
import backupActions from "./backup/actions"
import messageActions from "./message/actions"
import sessionActions from "./session/actions"
import windowActions from "./window/actions"

const actions = {
  backup: backupActions,
  session: sessionActions,
  window: windowActions,
  message: messageActions,
  background: backgroundActions
}
export default actions