import type { Session } from "~utils/types"

const getUnsavedWindows = async (sessions: Session[]): Promise<chrome.windows.Window[]> => {
    let windows = []
    await chrome.windows.getAll()
        .then(response => {
            response.forEach(window => {
                const index = sessions.findIndex(session => { return session.windowId === window.id })
                if (index === -1) {
                    windows.push(window)
                }
            })
        })
    return windows
}

export default getUnsavedWindows