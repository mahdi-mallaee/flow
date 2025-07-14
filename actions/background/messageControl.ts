/**
 * Initializes the message control functionality for the background script.
 * This function sets up a listener for incoming messages from the content script
 * and handles various message types, such as alerting the user, saving and opening sessions,
 * and creating new sessions.
 *
 * @param gl - The global variable object for the background script.
 * @returns void
 */
import { Message, type BgGlobalVar } from "~utils/types"
import actions from "~actions"

export default function messageControl(
  gl: BgGlobalVar, sender: chrome.runtime.MessageSender, message: Message, payload: any, sendResponse: (data: any) => void
) {

  switch (message) {
    case Message.openSession:
      {
        gl.refreshUnsavedWindows = false
        actions.session.open(payload.sessionId, payload.alterSettingsBehavior, payload.currentWindowId, payload.exludedTabIndex)
          .then((res) => {
            sendResponse(res)
            gl.refreshUnsavedWindows = true
          })
        break
      }
    case Message.createSession:
      {
        gl.refreshUnsavedWindows = false
        actions.background.createSession(payload, sendResponse)
          .then(() => {
            gl.refreshUnsavedWindows = true
          })
        break
      }

  }
}
