import type { Session, Tab } from "~utils/types"
import saveSessionsTabs from "./sessions/saveSessionsTabs"
import createNewSession from "./sessions/createNewSession"
import getAllSessions from "./sessions/getAllSessions"
import changeSessionOpenStatus from "./sessions/changeSessionOpenStatus"
import refreshSessionsStatus from "./sessions/refreshSessionsStatus"
import deleteSession from "./sessions/deleteSession"
import changeSessionWindowId from "./sessions/changeSessionWindowId"
import getSessionTabs from "./sessions/getSessionTabs"
import deleteAllSessions from "./sessions/deleteAllSessions"

const Store = {
  sessions: {
    saveTabs: async (sessionId: string, tabs: Tab[]) => { await saveSessionsTabs(sessionId, tabs) },
    getTabs: async (sessionId: string): Promise<Tab[]> => { return await getSessionTabs(sessionId) },
    create: async (session: Session) => { await createNewSession(session) },
    getAll: async (): Promise<Session[]> => { return await getAllSessions() },
    changeOpenStatus: async (sessionId: string, isOpen: boolean) => { await changeSessionOpenStatus(sessionId, isOpen) },
    refreshStatus: async () => { await refreshSessionsStatus() },
    delete: async (sessionId: string) => { await deleteSession(sessionId) },
    changeWindowId: async (sessionId: string, windowId: number) => { await changeSessionWindowId(sessionId, windowId) },
    deleteAll: async () => { await deleteAllSessions() }
  }
}

export default Store
