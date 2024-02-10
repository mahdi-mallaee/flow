import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession, type SessionOpenStatus, type SessionTabsStore } from "~utils/types"
import refreshSessionsStatusStore from "./refreshSessionsStatusStore"

const deleteSessionStore = async (sessionId: string) => {
  const localStorage = new Storage({ area: 'local' })
  let basics: BasicSession[] = await localStorage.get(SessionsKeys.basic) || []
  let opens: SessionOpenStatus[] = await localStorage.get(SessionsKeys.open) || []
  let sessionsTabs: SessionTabsStore[] = await localStorage.get(SessionsKeys.tab) || []

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

  await localStorage.set(SessionsKeys.basic, basics)
  await localStorage.set(SessionsKeys.open, opens)
  await localStorage.set(SessionsKeys.tab, sessionsTabs)
  await refreshSessionsStatusStore()
}

export default deleteSessionStore