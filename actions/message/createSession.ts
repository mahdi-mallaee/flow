import { Message } from "~utils/types"

const createSession = async ({ windowId, title }: { windowId?: number, title?: string }): Promise<any> => {
  const response = await chrome.runtime.sendMessage(
    {
      message: Message.createSession,
      payload: { windowId, title }
    })
  return response
}

export default createSession