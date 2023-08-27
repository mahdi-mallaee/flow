import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type OpenSessionStore } from "~utils/types"
import refreshSessionsStatus from "./refreshSessionsStatus"

const changeSessionOpenStatus = async (sessionId: string, isOpen: boolean) => {
  const store = new Storage({ area: "local" })
  let opens: OpenSessionStore[] = await store.get(SessionsKeys.open) || []

  const openSessionIndex = opens.findIndex(os => os.sessionId === sessionId)
  if (openSessionIndex >= 0 && typeof opens[openSessionIndex].isOpen === 'boolean') {
    opens[openSessionIndex].isOpen = isOpen
  }
  await store.set(SessionsKeys.open, opens)
  await refreshSessionsStatus()
}

export default changeSessionOpenStatus