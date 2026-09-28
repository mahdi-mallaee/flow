import syncActionBehavior from "./syncActionBehavior"

const showUnsavedAlert = async (windowId: number) => {
  await chrome.action.setPopup({ popup: "tabs/unsavedAlert.html" })
  await chrome.action.openPopup({ windowId: windowId })
  await syncActionBehavior()
}

export default showUnsavedAlert