import { Storage } from "@plasmohq/storage"
import { SessionsKeys, type BasicSession, type OpenSessionStore, type SessionTabsStore, type WindowIdStore } from "~utils/types"
import refreshSessionsStatus from "./refreshSessionsStatus"

const deleteSession = async (sessionId: string) => {
  const store = new Storage({ area: 'local' })
  let basics: BasicSession[] = await store.get(SessionsKeys.basic) || []
  let windowIds: WindowIdStore[] = await store.get(SessionsKeys.windowId) || []
  let opens: OpenSessionStore[] = await store.get(SessionsKeys.open) || []
  let sessionsTabs: SessionTabsStore[] = await store.get(SessionsKeys.tab) || []

  const basicsIndex = basics.findIndex(b => b.id === sessionId)
  const windowIdsIndex = windowIds.findIndex(w => w.sessionId === sessionId)
  const opensIndex = opens.findIndex(o => o.sessionId === sessionId)
  const sessionsTabsIndex = sessionsTabs.findIndex(s => s.sessionId === sessionId)

  if (basicsIndex >= 0 && windowIdsIndex >= 0 && opensIndex >= 0 && sessionsTabsIndex >= 0) {
    basics.splice(basicsIndex, 1)
    windowIds.splice(windowIdsIndex, 1)
    opens.splice(opensIndex, 1)
    sessionsTabs.splice(sessionsTabsIndex, 1)
  }

  await store.set(SessionsKeys.basic, basics)
  await store.set(SessionsKeys.windowId, windowIds)
  await store.set(SessionsKeys.open, opens)
  await store.set(SessionsKeys.tab, sessionsTabs)
  await refreshSessionsStatus()
}

export default deleteSession