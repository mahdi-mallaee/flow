import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession } from "~utils/types"
import refreshSessionsStatusStore from "./refreshSessionsStatusStore"

const setSessionAsMainStore = async (sessionId: string) => {
  const store = new Storage({ area: 'local' })
  const basicSessions: BasicSession[] = await store.get(SessionsKeys.basic) || []
  const newBasicSessions = basicSessions.map(session => {
    if (session.id === sessionId) {
      session.main = !session.main
    } else {
      session.main = false
    }
    return session
  })

  await store.set(SessionsKeys.basic, newBasicSessions)
  await refreshSessionsStatusStore()

}

export default setSessionAsMainStore