import { localStore } from "~utils/storageManager"
import { SessionsKeys, type SessionOpenStatus } from "~utils/types"

const getOpenStatus = async (): Promise<SessionOpenStatus[]> => {
  const localStorage = localStore
  const sessionsOpenStatus: SessionOpenStatus[] = await localStorage.get(SessionsKeys.open) || []
  return sessionsOpenStatus
}

export default getOpenStatus