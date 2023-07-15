import { Storage } from "@plasmohq/storage"

const refreshLastClosedWindow = async () => {
    const store = new Storage({ area: 'local' })

    const windows = await chrome.windows.getAll()
    if (windows) {
        if (windows.length === 1) {
            store.set('lastClosedWindowId', windows[0].id)
        } else {
            store.remove('lastClosedWindowId')
        }
    }
}

export default refreshLastClosedWindow