import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"

const editTitle = async (sessionId: string, title: string) => {
  const localStorage = new Storage({ area: 'local' })
  const basicSessions: BasicSession[] = await localStorage.get(SessionsKeys.basic) || []
  const index = basicSessions.findIndex(s => s.id === sessionId)
  if (index >= 0 && title) {
    basicSessions[index].title = title
  }
  await localStorage.set(SessionsKeys.basic, basicSessions)
  await refreshSessionStatus()
}

export default editTitle