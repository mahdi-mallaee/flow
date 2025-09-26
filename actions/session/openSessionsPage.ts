import actions from "~actions"

type input = {
  windowId: number,
  pin?: boolean,
  active?: boolean,
}

const openSessionsPage = async ({ windowId, pin = true, active = false }: input) => {
  const pageUrl = chrome.runtime.getURL('tabs/sessions.html')
  const windowTabs = await actions.window.getTabs(windowId)
  const index = windowTabs.findIndex(tab => tab.url === pageUrl)

  if (windowTabs && index === -1) {
    await chrome.tabs.create({
      url: pageUrl,
      pinned: pin,
      active: active,
      index: 0,
      windowId: windowId
    })
  }
}

export default openSessionsPage