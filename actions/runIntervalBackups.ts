import { Storage } from "@plasmohq/storage"
import { StoreKeys, type Settings, DefaultSettings } from "~utils/types"
import createNewBackup from "./createNewBackup"
import Store from "~store"

const runIntervalBakcups = async () => {
  const store = new Storage({ area: 'local' })
  const settings = await Store.settings.getAll()
  const interval = Number.parseInt(settings.autoBackupsInterval) * 60 * 1000

  if (interval > 0) {
    const intervalId = setInterval(() => {
      createNewBackup({
        status: 'interval backups',
      })
    }, interval)

    await store.set(StoreKeys.autoBackupIntervalId, intervalId)
  }

}

export default runIntervalBakcups