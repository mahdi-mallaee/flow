import { Storage } from "@plasmohq/storage"
import type { Settings } from "~utils/types"
import createNewBackup from "./createNewBackup"

const runIntervalBakcups = async () => {
  const store = new Storage({ area: 'local' })
  const settings: Settings = await store.get('settings')
  const interval = Number.parseInt(settings.autoBackupsInterval) * 60 * 1000

  if (interval > 0) {
    const intervalId = setInterval(() => {
      createNewBackup({
        status: 'interval backups',
      })
    }, interval)

    await store.set('autoBackupIntervalId', intervalId)
  }

}

export default runIntervalBakcups