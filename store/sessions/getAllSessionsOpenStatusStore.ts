import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionOpenStatus } from "~utils/types"

const getAllSessionsOpenStatusStore = async (): Promise<SessionOpenStatus[]> => {
  const localStorage = new Storage({ area: "local" })
  const sessionsOpenStatus: SessionOpenStatus[] = await localStorage.get(SessionsKeys.open) || []
  return sessionsOpenStatus
}

export default getAllSessionsOpenStatusStore