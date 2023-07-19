import { Storage } from "@plasmohq/storage"

type OpenedTabs = {
  id: number,
  discarded: boolean
}

const discardOpenedTab = async (id: number,) => {
  const store = new Storage({ area: 'local' })
  const openedTabs: OpenedTabs[] = await store.get('openedTabs')
  if (openedTabs && openedTabs.length >= 1) {
    const tab = openedTabs.find(ot => ot.id === id)
    if (tab) {
      chrome.tabs.discard(tab.id)
      tab.discarded = true
    }
    store.set('openedTabs', openedTabs)
  }
}

export default discardOpenedTab