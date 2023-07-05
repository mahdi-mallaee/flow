import { Storage } from "@plasmohq/storage"
import getUnsavedWindows from "../actions/getUnsavedWindows"

const refreshUnsavedWindows = async () => {
    const storage = new Storage({ area: 'local' })

    storage.get('sessions')
        .then((sessions: any) => {
            getUnsavedWindows(sessions)
                .then(windows => {
                    storage.set('unsaved-windows', windows)
                })
        })
}

export default refreshUnsavedWindows