import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type WindowIdStore } from "~utils/types"

const changeSessionWindowId = async (sessionId: string, windowId: number) => {
  const store = new Storage({ area: 'local' })
  const windowIdStore: WindowIdStore[] = await store.get(SessionsKeys.windowId)
  const index = windowIdStore.findIndex(wis => wis.sessionId === sessionId)
  if (index >= 0) {
    windowIdStore[index].windowId = windowId
    await store.set(SessionsKeys.windowId, windowIdStore)
  }
}

export default changeSessionWindowId