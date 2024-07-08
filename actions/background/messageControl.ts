import actions from "~actions"
import { Message, type BgGlobalVar } from "~utils/types"

const initMessageControl = async (gl: BgGlobalVar) => {
  chrome.runtime.onMessage.addListener(async (
    { message, payload }:
      { message: Message, payload: any }, sender, sendResponse) => {

    switch (message) {
      case Message.alertReady:
        {
          if (sender.tab) {
            await actions.background.alertGo(sender, sendResponse)
          }
          break
        }
      case Message.saveSession:
        {
          await actions.background.saveSession(sender, sendResponse)
          break
        }
      case Message.openSession:
        {
          gl.refreshUnsavedWindows = false
          await actions.session.open(payload.sessionId, payload.alterSettingsBehavior, payload.windowId)
          gl.refreshUnsavedWindows = true
          break
        }
      case Message.createSession:
        {
          gl.refreshUnsavedWindows = false
          await actions.background.createSession(payload, sendResponse)
          gl.refreshUnsavedWindows = true
          break
        }
      default:
        return true
    }

    return true
  })
}

export default initMessageControl