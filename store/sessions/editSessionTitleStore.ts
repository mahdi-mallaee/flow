import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession } from "~utils/types"
import refreshSessionsStatusStore from "./refreshSessionsStatusStore"

const editSessionTitleStore = async (sessionId: string, title: string) => {
  const store = new Storage({ area: 'local' })
  const basicSessions: BasicSession[] = await store.get(SessionsKeys.basic) || []
  const index = basicSessions.findIndex(s => s.id === sessionId)
  if (index >= 0 && title) {
    basicSessions[index].title = title
  }
  await store.set(SessionsKeys.basic, basicSessions)
  await refreshSessionsStatusStore()
}

export default editSessionTitleStore