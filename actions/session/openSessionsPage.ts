
type input = {
  windowId: number,
  pin?: boolean,
  active?: boolean,
}

const createSessionsPage = async ({ windowId, pin = true, active = false }: input) => {
  const pageUrl = 'chrome-extension://' + chrome.runtime.id + '/tabs/sessions.html'
  await chrome.tabs.create({
    url: pageUrl,
    pinned: pin,
    active: active,
    index: 0,
    windowId: windowId
  })
}

export default createSessionsPage