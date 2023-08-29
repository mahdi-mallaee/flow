import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession, type SessionOpenStatus, type SessionTabsStore } from "~utils/types"
import refreshSessionsStatus from "./refreshSessionsStatus"

const deleteSession = async (sessionId: string) => {
  const store = new Storage({ area: 'local' })
  let basics: BasicSession[] = await store.get(SessionsKeys.basic) || []
  let opens: SessionOpenStatus[] = await store.get(SessionsKeys.open) || []
  let sessionsTabs: SessionTabsStore[] = await store.get(SessionsKeys.tab) || []

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

  await store.set(SessionsKeys.basic, basics)
  await store.set(SessionsKeys.open, opens)
  await store.set(SessionsKeys.tab, sessionsTabs)
  await refreshSessionsStatus()
}

export default deleteSession