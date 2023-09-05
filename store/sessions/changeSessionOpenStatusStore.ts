import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionOpenStatus } from "~utils/types"
import refreshSessionsStatusStore from "./refreshSessionsStatusStore"

const changeSessionOpenStatusStore = async (sessionId: string, isOpen: boolean) => {
  const store = new Storage({ area: "local" })
  let opens: SessionOpenStatus[] = await store.get(SessionsKeys.open) || []

  const openSessionIndex = opens.findIndex(os => os.sessionId === sessionId)
  if (openSessionIndex >= 0 && typeof opens[openSessionIndex].isOpen === 'boolean') {
    opens[openSessionIndex].isOpen = isOpen
  }
  await store.set(SessionsKeys.open, opens)
  await refreshSessionsStatusStore()
}

export default changeSessionOpenStatusStore