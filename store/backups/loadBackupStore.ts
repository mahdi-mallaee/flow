import { Storage } from "@plasmohq/storage"
import actions from "~actions"
import store from "~store"
import { WINDOWID_NONE } from "~utils/constants"
import { StoreKeys, type Backup } from "~utils/types"

const loadBackupStore = async (id: string) => {
  const localStorage = new Storage({ area: 'local' })
  let backups: Backup[] = await localStorage.get(StoreKeys.backups) || []
  const index = backups.findIndex(b => b.id === id)
  const backup = index >= 0 ? backups[index] : undefined

  if (backup && backup.sessions) {

    backup.sessions.forEach(session => {
      session.isOpen = false
      session.windowId = WINDOWID_NONE
    })
    await store.sessions.setAll(backup.sessions)
    await actions.window.refreshUnsavedWindows()
  }
}

export default loadBackupStore