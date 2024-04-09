import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"

const editTitle = async (sessionId: string, title: string): Promise<boolean> => {
  const localStorage = new Storage({ area: 'local' })
  const basicSessions: BasicSession[] = await localStorage.get(SessionsKeys.basic) || []
  const index = basicSessions.findIndex(s => s.id === sessionId)
  if (index >= 0 && title) {
    basicSessions[index].title = title
    try {
      await localStorage.set(SessionsKeys.basic, basicSessions)
      await refreshSessionStatus()
      return true
    } catch (error) {
      if(process.env.NODE_ENV === 'development') {
        console.error('ERROR: could not set the sessions -> store/sessions/editTitle l.8')
      }
      return false
    }
  } else {
    if(process.env.NODE_ENV === 'development') {
      console.error('ERROR: could not find the session -> store/sessions/editTitle l.8')
    }
    return false
  }
}

export default editTitle