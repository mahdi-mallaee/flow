const showUnsavedAlert = async (windowId: number) => {
  await chrome.action.setPopup({ popup: "tabs/unsavedAlert.html" })
  await chrome.action.openPopup({ windowId: windowId })
  await chrome.action.setPopup({ popup: "popup.html" })
}

export default showUnsavedAlert