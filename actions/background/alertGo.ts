/**
 * Checks if sender tab is included in the unsaved window and also not any other alerts have been shown for that window,
 * and sends a response with the `alertGo` message if so.
 *
 * @param sender - The `chrome.runtime.MessageSender` object containing information about the message sender.
 * @param sendResponse - A function to send a response back to the message sender.
 */
import actions from "~actions"
import store from "~store"
import { Message } from "~utils/types"

const alertGo = async (sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
  const status = await store.windows.getUnsavedWindowAlertStatus()
  if (!status.alertShown) {
    const include = await actions.window.includesTab(status.windowId, sender.tab.id)
    if (include) {
      sendResponse({ message: Message.alertGo })
    }
  }
}
export default alertGo