/**
 * Initializes the message control functionality for the background script.
 * This function sets up a listener for incoming messages from the content script
 * and handles various message types, such as alerting the user, saving and opening sessions,
 * and creating new sessions.
 *
 * @param gl - The global variable object for the background script.
 * @returns void
 */
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
    // returing true to keep connection alive for response
    return true
  })
}

export default initMessageControl