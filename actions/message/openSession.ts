import { Message } from "~utils/types"

const openSession = async (sessionId: string): Promise<any> => {
  const currentWindowId = (await chrome.windows.getCurrent()).id
  const response = await chrome.runtime.sendMessage({ message: Message.openSession, sessionId, currentWindowId })
  return response
}

export default openSession