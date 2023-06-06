import type { Session } from "~utils/types";

const storageSetSessions = async (sessions: Session[]) => {
    await chrome.storage.local.set({ 'sessions': sessions })
}

export default storageSetSessions