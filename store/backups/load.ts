import { Storage } from "@plasmohq/storage"
import actions from "~actions"
import store from "~store"
import { WINDOWID_NONE } from "~utils/constants"
import { StoreKeys, type Backup } from "~utils/types"

const load = async (id: string): Promise<boolean> => {
  const localStorage = new Storage({ area: 'local' })
  let backups: Backup[] = await localStorage.get(StoreKeys.backups) || []
  const index = backups.findIndex(b => b.id === id)
  const backup = index >= 0 ? backups[index] : undefined

  if (backup && backup.sessions) {

    // closing sessions in the backup so they don't appear open in the UI although there is no valid windowId assigned to them
    backup.sessions.forEach(session => {
      session.isOpen = false
      session.windowId = WINDOWID_NONE
    })

    const result = await store.sessions.setAll(backup.sessions)
    if (!result) {
      if (process.env.NODE_ENV === 'development') {
        console.error('ERROR: could not set the backup sessions -> store/backup/load l.21 ')
      }
      return false
    }

    await actions.window.refreshUnsavedWindows()
    return true

  } else {
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR: could not find the backup -> store/backup/load l.10 ')
    }
    return false
  }
}

export default load