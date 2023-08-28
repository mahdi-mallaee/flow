import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type SessionOpenStatus } from "~utils/types"

const getAllSessionsOpenStatus = async (): Promise<SessionOpenStatus[]> => {
  const store = new Storage({ area: "local" })
  const sessionsOpenStatus: SessionOpenStatus[] = await store.get(SessionsKeys.open) || []
  return sessionsOpenStatus
}

export default getAllSessionsOpenStatus