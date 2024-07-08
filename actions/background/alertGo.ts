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