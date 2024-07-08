/**
 * Saves the current session by creating a new session if the number of sessions has not reached the limit.
 *
 * @param sender - The message sender object, which contains information about the tab that sent the message.
 * @param sendResponse - A function to send a response back to the message sender.
 * @returns - Void, but sends a response to the message sender indicating whether the session was saved successfully or not.
 */
import actions from "~actions"
import { Message } from "~utils/types"

const saveSession = async (sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
  if (actions.window.checkId(sender.tab.windowId)) {
    const check = await actions.session.checkNumberLimit()
    if (check) {
      const result = await actions.session.create({ windowId: sender.tab.windowId })
      if (result) {
        sendResponse({ message: Message.success })
        return
      }
    }
  }
  sendResponse({ message: Message.error })
}

export default saveSession