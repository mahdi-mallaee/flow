import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionOpenStatus } from "~utils/types"

const changeSessionWindowIdStore = async (sessionId: string, windowId: number) => {
  const store = new Storage({ area: 'local' })
  const sessionsOpenStatus: SessionOpenStatus[] = await store.get(SessionsKeys.open) || []
  const index = sessionsOpenStatus.findIndex(session => session.sessionId === sessionId)
  if (index >= 0) {
    sessionsOpenStatus[index].windowId = windowId
    await store.set(SessionsKeys.open, sessionsOpenStatus)
  }
}

export default changeSessionWindowIdStore