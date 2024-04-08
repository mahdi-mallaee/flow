import { Message } from "~utils/types"

const openSession = async (sessionId: string, alterSettingsBehavior = false): Promise<any> => {
  const currentWindowId = (await chrome.windows.getCurrent()).id
  const response = await chrome.runtime.sendMessage(
    {
      message: Message.openSession,
      payload: { sessionId, currentWindowId, alterSettingsBehavior }
    })
  return response
}

export default openSession