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