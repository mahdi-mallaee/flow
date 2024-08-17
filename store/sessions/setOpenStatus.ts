import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionOpenStatus } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"

const setOpenStatus = async (sessionId: string, isOpen: boolean) => {
  const localStorage = new Storage({ area: "local" })
  let sessionsOpenStatus: SessionOpenStatus[] = await localStorage.get(SessionsKeys.open) || []

  const openSessionIndex = sessionsOpenStatus.findIndex(os => os.sessionId === sessionId)
  if (openSessionIndex >= 0 && typeof sessionsOpenStatus[openSessionIndex].isOpen === 'boolean') {
    sessionsOpenStatus[openSessionIndex].isOpen = isOpen
  } else if (sessionId) {
    sessionsOpenStatus.push({ sessionId, isOpen, windowId: -1 })
  }
  await localStorage.set(SessionsKeys.open, sessionsOpenStatus)
  await refreshSessionStatus()
}

export default setOpenStatus