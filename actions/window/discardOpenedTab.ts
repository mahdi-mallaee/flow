import store from "~store"
import type { OpenedTab } from "~utils/types"

/*
  This function uses the provided tab id from background in tabs.onUpdate event for
  discarding tabs from memory so sessions that have a lot of tabs could be loaded faster
*/

const discardOpenedTab = async (id: number,) => {
  const openedTabs: OpenedTab[] = await store.windows.getOpenedTabs()
  if (openedTabs && openedTabs.length >= 1) {
    const tab = openedTabs.find(ot => ot.id === id)
    if (tab && id && !tab.discarded) {
      /*
        sometimes tabs.discard returns error: there is no tabs with id [tab.id (number)] and distrupts 
        extensions flow like prventing the session from closing or not letting tabs to group so
        I used try catch so the error wouldn't distrupts the flow and works normal although maybe a tab wont be
        discarded this way but that is not a huge deal and i didn't know what to do with the error so I just logged it
      */
      try {
        await chrome.tabs.discard(id)
      }
      catch (error) {
        console.log(error)
      }
      tab.discarded = true
    }
    await store.windows.setOpenedTabs(openedTabs)
  }
}

export default discardOpenedTab