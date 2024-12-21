import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession, type TabGroup } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"

interface updateInfo {
  title?: string,
  main?: boolean,
  groups?: TabGroup[],
  colorCode?: number
}

const basicUpdate = async (sessionId: string, { title, main, groups, colorCode }: updateInfo): Promise<boolean> => {
  const localStorage = new Storage({ area: 'local' })
  const sessions: BasicSession[] = await localStorage.get(SessionsKeys.basic) || []
  const session = sessions.find(s => s.id === sessionId)
  if (session) {

    if (title) {
      session.title = title
    }

    if (main) {
      sessions.forEach(session => {
        if (session.id === sessionId) {
          session.main = !session.main
        } else {
          session.main = false
        }
        return session
      })
    }

    if (groups) {
      session.groups = groups
    }

    if (colorCode) {
      session.colorCode = colorCode
    }


    try {
      await localStorage.set(SessionsKeys.basic, sessions)
      await refreshSessionStatus()
      return true
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('ERROR: could not set the sessions -> store/sessions/basicUpdate l.38')
      }
      return false
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR: could not find the session -> store/sessions/basicUpdate l.38')
    }
    return false
  }
}

export default basicUpdate