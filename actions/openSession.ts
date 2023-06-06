import createNewWindow from "./createNewWindow";
import type { Session } from "~utils/types";
import getTabsByWindowId from "./getTabsByWindowId";

const openSession = async (sessions: Session[], sessionId: string): Promise<Session[]> => {
    const session = sessions.find(s => { return s.id === sessionId })
    const newWindowId = await createNewWindow(session.tabs.map(t => { return t.url }))
    const tabs = await getTabsByWindowId(newWindowId)

    const newSessions = sessions.map(s => {
        if (s.id === sessionId) {
            s.windowId = newWindowId;
            s.tabs = tabs;
        }
        return s;
    })

    await chrome.tabs.query({ windowId: newWindowId })
        .then(tabs => {
            if (tabs[0].id) {
                chrome.tabs.remove(tabs[0].id)
            }
        })
    return newSessions
}

export default openSession