import { localStore } from "~utils/storageManager"
import { SessionsKeys } from "~utils/types"

const getNumbers = async (): Promise<number> => {
  const localStorage = localStore
  const basicSessions = await localStorage.get(SessionsKeys.basic) || []
  return basicSessions.length
}

export default getNumbers