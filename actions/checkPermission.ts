const checkPermission = async (permission: string) => {
  const contains = await chrome.permissions.contains({ permissions: [permission] })
  if (contains) {
    return true
  } else {
    const granted = await chrome.permissions.request({ permissions: [permission] });
    return granted
  }
}

export default checkPermission