import type { Session } from "~utils/types"

const storageGetSesstion = async (): Promise<Session[]> => {
    const sessions = (await chrome.storage.local.get(['sessions'])).sessions || []
    return sessions
}

export default storageGetSesstion