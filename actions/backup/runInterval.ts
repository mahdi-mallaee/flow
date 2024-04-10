import { Storage } from "@plasmohq/storage"
import { StoreKeys } from "~utils/types"
import store from "~store"
import actions from "~actions"

/**
 * Runs an interval that automatically creates a backup at the specified interval.
 * The interval is determined by the user's settings, and is stored in the local storage.
 * If the interval is set to 0, no interval will be created.
 */
const runInterval = async () => {
  const localStorage = new Storage({ area: 'local' })
  const settings = await store.settings.getAll()
  const interval = Number.parseInt(settings.autoBackupsInterval) * 60 * 1000

  if (interval > 0) {
    const intervalId = setInterval(() => {
      actions.backup.create({
        status: 'interval backups',
      })
    }, interval)

    await localStorage.set(StoreKeys.autoBackupIntervalId, intervalId)
  }

}

export default runInterval