import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession, type TabGroup } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"

const setGroups = async (sessionId: string, groups: TabGroup[]) => {
  const localStorage = new Storage({ area: 'local' })
  const basicSessions: BasicSession[] = await localStorage.get(SessionsKeys.basic) || []
  const index = basicSessions.findIndex(s => s.id === sessionId)
  if (index >= 0) {
    basicSessions[index].groups = groups
  }
  await localStorage.set(SessionsKeys.basic, basicSessions)
  await refreshSessionStatus()
}

export default setGroups