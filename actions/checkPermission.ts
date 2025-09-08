const checkPermission = (permission: string) => {
  return new Promise<boolean>((resolve) => {
    chrome.permissions.contains({ permissions: [permission] }, (result) => {
      if (result) {
        resolve(true)
      } else {
        chrome.permissions.request({ permissions: [permission] }, (granted) => {
          resolve(granted)
        })
      }
    })
  })
}

export default checkPermission