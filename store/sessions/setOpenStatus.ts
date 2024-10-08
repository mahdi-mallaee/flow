import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionOpenStatus } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"
import actions from "~actions"

const setOpenStatus = async (sessionId: string, status: Partial<SessionOpenStatus>) => {
  {
    const localStorage = new Storage({ area: "local" })
    let sessionsOpenStatus: SessionOpenStatus[] = await localStorage.get(SessionsKeys.open) || []

    let index = sessionsOpenStatus.findIndex(os => os.sessionId === sessionId)
    let newStatus: SessionOpenStatus = { sessionId: sessionId, isOpen: false, windowId: -1, freeze: false }

    if (index === -1 && sessionId) {
      index = sessionsOpenStatus.push(newStatus) - 1
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