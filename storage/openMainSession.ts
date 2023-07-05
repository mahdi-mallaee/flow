import { Storage } from "@plasmohq/storage"
import openSession from "~actions/openSession"
import type { Session } from "~utils/types"
import refreshUnsavedWindows from "./refreshUnsavedWindows"

const openMainSession = async () => {
    const storage = new Storage({ area: 'local' })

    const sessions: Session[] = await storage.get('sessions')
    const mainSession: Session = sessions.find((session: Session) => session.main === true)

    if (mainSession) {
        const newSessions = await openSession(sessions, mainSession.id)
        storage.set('sessions', newSessions)
            .then(() => {
                chrome.windows.getAll()
                    .then(windows => {
                        windows.forEach(window => {
                            if (window.id !== mainSession.windowId) {
                                chrome.windows.remove(window.id)
                                    .then(() => {
                                        refreshUnsavedWindows()
                                    })
                            }
                        })
                    })
            })
    }
}

export default openMainSession