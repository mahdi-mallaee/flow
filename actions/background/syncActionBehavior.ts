import store from "~store"
import { logger } from "~utils/logger"
import { DefaultAction } from "~utils/types"

/**
 * Synchronizes browser action button behavior (popup, sessionManager, sidepanel)
 * with user's settings.
 */
const syncActionBehavior = async () => {
  try {
    const settings = await store.settings.getAll()
    const option = settings.defaultAction

    if (option === DefaultAction.sessionManager) {
      if (chrome.action?.setPopup) {
        await chrome.action.setPopup({ popup: "" })
      }
      if (chrome.sidePanel?.setPanelBehavior) {
        await chrome.sidePanel.setPanelBehavior({
          openPanelOnActionClick: false
        })
        await chrome.sidePanel.setOptions({ enabled: false })
      }
    } else if (option === DefaultAction.sidepanel && chrome.sidePanel) {
      if (chrome.action?.setPopup) {
        await chrome.action.setPopup({ popup: "" })
      }
      await chrome.sidePanel.setPanelBehavior({
        openPanelOnActionClick: true
      })
      await chrome.sidePanel.setOptions({ enabled: true })
    } else {
      // Default popup
      if (chrome.action?.setPopup) {
        await chrome.action.setPopup({ popup: "popup.html" })
      }
      if (chrome.sidePanel?.setPanelBehavior) {
        await chrome.sidePanel.setPanelBehavior({
          openPanelOnActionClick: false
        })
        await chrome.sidePanel.setOptions({ enabled: false })
      }
    }
  } catch (error) {
    logger.error("Failed to sync action behavior:", error)
  }
}

export default syncActionBehavior
