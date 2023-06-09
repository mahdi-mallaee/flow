import type { Session, Tab } from "~utils/types";

const saveClosingTabs = (sessions: Session[], closingTabs: Tab[]): Session[] => {
    const windowId = closingTabs[0].windowId
    const newSessions = sessions.map(session => {
        if (session.windowId === windowId) {
            session.tabs = closingTabs
        }
        return session
    })
    return newSessions
}

export default saveClosingTabs