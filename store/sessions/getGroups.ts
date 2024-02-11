import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession, type TabGroup } from "~utils/types"

const getGroups = async (sessionId: string): Promise<TabGroup[]> => {
  const localStorage = new Storage({ area: 'local' })
  const basicSessions: BasicSession[] = await localStorage.get(SessionsKeys.basic) || []
  const index = basicSessions.findIndex(s => s.id === sessionId)
  let groups: TabGroup[] = []
  if (index >= 0) {
    groups = basicSessions[index].groups
  }

  return groups
}

export default getGroups