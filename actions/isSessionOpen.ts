import type { Session } from "~utils/types";

const isSessionOpen = async (sessions: Session[], sessionId: string): Promise<boolean> => {
  let isOpen = false

  const windowId = sessions.find(s => s.id === sessionId).windowId
  if (!windowId) { isOpen = true }

  const windows = await chrome.windows.getAll()
  if (!windows || windows.length < 1) { isOpen = true }

  windows.forEach(win => {
    if (win.id === windowId) {
      isOpen = true
    }
  })

  return isOpen
}

export default isSessionOpen