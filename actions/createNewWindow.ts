const createNewWindow = async (urls?: string[]): Promise<number> => {
  let id: number = -1
  const window = await chrome.windows.create()
  if (window.id) {
    id = window.id
  }

  if (urls && id !== -1) {
    urls.forEach(url => {
      chrome.tabs.create({ windowId: id, url })
    })
  }

  return id
}

export default createNewWindow