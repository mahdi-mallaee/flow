import createNewWindow from "./createNewWindow";
import type { Session } from "~utils/types";
import getTabsByWindowId from "./getTabsByWindowId";
import { Storage as store } from '@plasmohq/storage'


const storage = new store({ area: 'local' })

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


    // await chrome.tabs.query({ windowId: newWindowId })
    //     .then(tabs => {
    //         if (tabs[0].id) {
    //             chrome.tabs.remove(tabs[0].id)
    //         }
    //     })

    storage.set('sessions', newSessions)
    return newSessions
}

export default openSession