import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionOpenStatus } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"
import actions from "~actions"

const setOpenStatus = async (sessionId: string, status: Partial<SessionOpenStatus>) => {
  {
    const localStorage = new Storage({ area: "local" })
    let sessionsOpenStatus: SessionOpenStatus[] = await localStorage.get(SessionsKeys.open) || []

    let index = sessionsOpenStatus.findIndex(os => os.id === sessionId)
    let newStatus: SessionOpenStatus = { id: sessionId, isOpen: false, windowId: -1 }

    if (index === -1 && sessionId) {
      index = sessionsOpenStatus.push(newStatus) - 1
    }


    if (typeof status.isOpen === 'boolean' && typeof sessionsOpenStatus[index].isOpen === 'boolean') {
      sessionsOpenStatus[index].isOpen = status.isOpen
    }

    if (typeof status.windowId === "number" && typeof sessionsOpenStatus[index].windowId === 'number') {
      sessionsOpenStatus[index].windowId = status.windowId
    }

    await localStorage.set(SessionsKeys.open, sessionsOpenStatus)
    await refreshSessionStatus()
  }
}

export default setOpenStatus