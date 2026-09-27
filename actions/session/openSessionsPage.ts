import actions from "~actions"

type input = {
  windowId?: number
  pin?: boolean
  active?: boolean
}

const openSessionsPage = async ({ windowId, pin = true, active = true }: input = {}) => {
  const targetWindowId = actions.window.checkId(windowId)
    ? windowId
    : (await chrome.windows.getCurrent()).id
  const pageUrl = chrome.runtime.getURL("tabs/sessions.html")
  const windowTabs = await actions.window.getTabs(targetWindowId)
  const index = windowTabs ? windowTabs.findIndex((tab) => tab.url === pageUrl) : -1

  if (windowTabs && index !== -1) {
    await chrome.tabs.update(windowTabs[index].id, { active: true })
    await chrome.windows.update(targetWindowId, { focused: true })
  } else {
    await chrome.tabs.create({
      url: pageUrl,
      pinned: pin,
      active: active,
      index: 0,
      windowId: targetWindowId
    })
  }
}

export default openSessionsPage