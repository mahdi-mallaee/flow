const createNewWindow = async (urls?: string[]): Promise<number> => {
  let id: number
  await chrome.windows.create()
    .then(res => {
      if (res.id) {
        id = res.id
      } else {
        id = -1
      }

    })
    .catch(() => {
      id = -1
    })

  if (urls && id !== -1) {
    urls.forEach(url => {
      chrome.tabs.create({ windowId: id, url })
    })
  }

  return id
}

export default createNewWindow