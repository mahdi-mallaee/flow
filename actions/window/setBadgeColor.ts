import store from "~store"
import { COLOR_CODES } from "~utils/constants"

const setBadgeColors = async ({ sessionId, windowId }: { sessionId?: string, windowId?: number }) => {
  const sessions = await store.sessions.getAll()
  const session = sessionId ? sessions.find(s => s.id === sessionId) : sessions.find(s => s.windowId === windowId)

  const settings = await store.settings.getAll()
  if (settings.showSessionBadge) {
    if (session) {
      await chrome.action.setBadgeText({ text: session.title[0].toUpperCase() })
      await chrome.action.setBadgeBackgroundColor({ color: COLOR_CODES[session.colorCode] })
    } else {
      await chrome.action.setBadgeBackgroundColor({ color: "white" })
      await chrome.action.setBadgeText({ text: 'N' })
    }
  } else {
    await chrome.action.setBadgeText({ text: '' })
  }
}

export default setBadgeColors