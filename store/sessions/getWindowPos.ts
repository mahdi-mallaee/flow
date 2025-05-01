import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession, type WindowPosition } from "~utils/types"

const getWindowPos = async (sessionId: string): Promise<WindowPosition> => {
  const localStorage = new Storage({ area: 'local' })
  const basicSessions: BasicSession[] = await localStorage.get(SessionsKeys.basic) || []
  const index = basicSessions.findIndex(s => s.id === sessionId)
  let pos: WindowPosition = {}
  if (index >= 0) {
    pos = basicSessions[index].windowPos
  }

  return pos
}

export default getWindowPos