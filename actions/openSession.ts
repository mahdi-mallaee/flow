import createNewWindow from "./createNewWindow";
import type { Session, Tab } from "~utils/types";
import getTabsByWindowId from "./getTabsByWindowId";
import { Storage as store } from '@plasmohq/storage'


const storage = new store({ area: 'local' })

const openSession = async (sessions: Session[], sessionId: string): Promise<Session[]> => {
    const session = sessions.find(s => { return s.id === sessionId })
    const newWindowId = await createNewWindow(session.tabs.map(t => { return t.url }))
    const tabs = await getTabsByWindowId(newWindowId)
    const groups = {}

    session.tabs.forEach(tab => {
        const key = tab.groupId.toString()
        if (tab.groupId > 0) {
            if (groups[key]) {
                groups[key].push(tabs[tab.index].id + 1)
            } else {
                groups[key] = [tabs[tab.index].id + 1]
            }
        }
    })
    Object.keys(groups).forEach(group => {
        const tabIds: number[] = groups[group]
        chrome.tabs.group({ tabIds: tabIds, createProperties: { windowId: newWindowId } })
    })


    const newSessions = sessions.map(s => {
        if (s.id === sessionId) {
            s.windowId = newWindowId;
            s.tabs = tabs;
        }
        return s;
    })

    storage.set('sessions', newSessions)

    chrome.tabs.query({ windowId: newWindowId })
        .then(tabs => {
            if (tabs[0].id) {
                chrome.tabs.remove(tabs[0].id)
            }
        })

    return newSessions
}

export default openSession