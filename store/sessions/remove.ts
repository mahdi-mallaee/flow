import { localStore } from "~utils/storageManager"
import { SessionsKeys, type BasicSession, type SessionOpenStatus, type SessionTabsStore } from "~utils/types"
import refreshSessionStatus from "./refreshSessionStatus"

const remove = async (sessionId: string) => {
  const localStorage = localStore
  const [basics = [], opens = [], sessionsTabs = []] = await Promise.all([
    localStorage.get<BasicSession[]>(SessionsKeys.basic).then(res => res || []),
    localStorage.get<SessionOpenStatus[]>(SessionsKeys.open).then(res => res || []),
    localStorage.get<SessionTabsStore[]>(SessionsKeys.tab).then(res => res || [])
  ])

  const basicsIndex = basics.findIndex(b => b.id === sessionId)
  const opensIndex = opens.findIndex(o => o.sessionId === sessionId)
  const sessionsTabsIndex = sessionsTabs.findIndex(s => s.sessionId === sessionId)

  if (basicsIndex >= 0) {
    basics.splice(basicsIndex, 1)
  }
  if (sessionsTabsIndex >= 0) {
    sessionsTabs.splice(sessionsTabsIndex, 1)
  }

  if (opensIndex >= 0) {
    opens.splice(opensIndex, 1)
  }

  await Promise.all([
    localStorage.set(SessionsKeys.basic, basics),
    localStorage.set(SessionsKeys.open, opens),
    localStorage.set(SessionsKeys.tab, sessionsTabs)
  ])
  await refreshSessionStatus()
}

export default remove