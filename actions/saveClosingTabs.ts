import type { Session, Tab } from "~utils/types";

const saveClosingTabs = (sessions: Session[], closingTabs: Tab[], windowId: number): Session[] => {
    const newSessions = sessions.map(session => {
        if (session.windowId === windowId) {
            session.tabs = closingTabs
        }
        return session
    })
    return newSessions
}

export default saveClosingTabs