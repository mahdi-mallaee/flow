import { Storage } from "@plasmohq/storage"
import type { Settings } from "~utils/types"

const createNewWindow = async (urls?: string[]): Promise<number> => {
  const store = new Storage({ area: 'local' })
  const settings: Settings = await store.get('settings')
  let id: number = -1
  const window = await chrome.windows.create({ state: settings.newSessionWindowState })
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