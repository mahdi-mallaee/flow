import { Message } from "~utils/types"

const createSession = async ({ windowId, title, updateWindow }: { windowId?: number, title?: string, updateWindow?: boolean }): Promise<boolean> => {
  const response = await chrome.runtime.sendMessage(
    {
      message: Message.createSession,
      payload: { windowId, title, updateWindow }
    })
  return response
}

export default createSession