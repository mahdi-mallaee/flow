import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionOpenStatus } from "~utils/types"

const changeSessionWindowIdStore = async (sessionId: string, windowId: number) => {
  const localStorage = new Storage({ area: 'local' })
  const sessionsOpenStatus: SessionOpenStatus[] = await localStorage.get(SessionsKeys.open) || []
  const index = sessionsOpenStatus.findIndex(session => session.sessionId === sessionId)
  if (index >= 0) {
    sessionsOpenStatus[index].windowId = windowId
    await localStorage.set(SessionsKeys.open, sessionsOpenStatus)
  }
}

export default changeSessionWindowIdStore