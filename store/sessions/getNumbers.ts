import { Storage } from "@plasmohq/storage"
import { SessionsKeys } from "~utils/types"

const getNumbers = async (): Promise<number> => {
  const localStorage = new Storage({ area: 'local' })
  const basicSessions = await localStorage.get(SessionsKeys.basic) || []
  return basicSessions.length
}

export default getNumbers