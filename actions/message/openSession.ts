import { Message } from "~utils/types"

/**
 * Sends a message to background to open the session with the given sessionId.
 * 
 * Reason for doing this is that if you modify a window from the popup,
 * it will close and the session will not open correctly.
 * 
 * Basically offloads the heavy work to background.
 *
 * @param sessionId - The ID of the session to open.
 * @param alterSettingsBehavior - Whether to alter the session opening settings to open the session 
 *    in the current window or in a separate window.
 * @returns A Promise that resolves with the response from the runtime message.
 */

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