import { Storage } from "@plasmohq/storage"
import { StoreKeys } from "~utils/types"
import store from "~store"
import actions from "~actions"

const runIntervalBakcups = async () => {
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

export default runIntervalBakcups