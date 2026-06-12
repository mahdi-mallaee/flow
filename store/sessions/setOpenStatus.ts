import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionOpenStatus } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"
import { WINDOWID_NONE } from "~utils/constants"

const setOpenStatus = async (sessionId: string, status: Partial<SessionOpenStatus>) => {
  {
    const localStorage = new Storage({ area: "local" })
    let sessionsOpenStatus: SessionOpenStatus[] = await localStorage.get(SessionsKeys.open) || []

    let index = sessionsOpenStatus.findIndex(os => os.sessionId === sessionId)
    const duplicateWindowIndex = sessionsOpenStatus.findIndex(os => os.windowId == status.windowId)

    if (index === -1 && sessionId) {
      let newStatus: SessionOpenStatus = {
        sessionId: sessionId,
        isOpen: status.isOpen || false,
        windowId: status.windowId || WINDOWID_NONE,
        freeze: status.freeze || false
      }
      index = sessionsOpenStatus.push(newStatus) - 1
    }
    
    if (duplicateWindowIndex !== -1 && sessionsOpenStatus[duplicateWindowIndex].sessionId !== sessionId) {
      sessionsOpenStatus[duplicateWindowIndex].isOpen = false
    }

    if (typeof status.isOpen === 'boolean') {
      sessionsOpenStatus[index].isOpen = status.isOpen
    }

    if (typeof status.windowId === "number") {
      sessionsOpenStatus[index].windowId = status.windowId
    }

    if (typeof status.freeze === "boolean") {
      sessionsOpenStatus[index].freeze = status.freeze
    }

    await localStorage.set(SessionsKeys.open, sessionsOpenStatus)
    await refreshSessionStatus()
  }
}

export default setOpenStatus