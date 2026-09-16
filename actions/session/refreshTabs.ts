import actions from "~actions"
import store from "~store"
import logger from "~utils/logger"
import type { BgGlobalVar, UnsavedWindow } from "~utils/types"

let isRefreshing = false
let hasPendingRefresh = false
let pendingPromise: Promise<void> | null = null
let currentGl: BgGlobalVar = { closingWindow: { status: false, windowId: -1 }, refreshUnsavedWindows: true }

const performRefresh = async (gl: BgGlobalVar): Promise<void> => {
  if (!gl.refreshUnsavedWindows) {
    return
  }

  const sessions = await store.sessions.getOpenStatus()

  for (const session of sessions) {
    if (session.isOpen && !session.freeze) {
      try {
        const tabs = await actions.window.getTabs(session.windowId)
        if (tabs && tabs.length > 0) {
          await store.sessions.setTabs(session.sessionId, tabs)
        }
      } catch (err) {
        logger.error("Failed to refresh tabs for session", session.sessionId, err)
      }
    }
  }

  try {
    const unsavedWindows: UnsavedWindow[] = await actions.window.refreshUnsavedWindows(true)
    for (const window of unsavedWindows) {
      const tabs = await actions.window.getTabs(window.id)
      if (tabs && tabs.length > 0) {
        window.tabsCount = tabs.length
      }
    }
    await store.windows.setUnsavedWindows(unsavedWindows)
  } catch (err) {
    logger.error("Failed to refresh unsaved windows", err)
  }
}

/**
 * Refreshes tabs for all open sessions and updates unsaved window counts.
 * Employs single-flight coalescing to eliminate race conditions, avoid storage write spam,
 * and prevent debounce timer starvation during rapid tab events.
 *
 * @param {BgGlobalVar} [gl] - Global background state
 * @returns {Promise<void>}
 */
const refreshTabs = async (gl: BgGlobalVar = { closingWindow: { status: false, windowId: -1 }, refreshUnsavedWindows: true }): Promise<void> => {
  currentGl = gl

  if (isRefreshing) {
    hasPendingRefresh = true
    return pendingPromise || Promise.resolve()
  }

  isRefreshing = true
  pendingPromise = (async () => {
    try {
      do {
        hasPendingRefresh = false
        await performRefresh(currentGl)
      } while (hasPendingRefresh)
    } finally {
      isRefreshing = false
      pendingPromise = null
    }
  })()

  return pendingPromise
}

export default refreshTabs