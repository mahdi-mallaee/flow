import store from "~store"

export const AUTO_BACKUP_ALARM = "flow-auto-backup"

/**
 * Sets up a recurring chrome alarm that automatically creates a backup at the specified interval.
 * If the interval is set to 0, any existing alarm will be cleared.
 */
const runInterval = async () => {
  if (!chrome.alarms) return
  const settings = await store.settings.getAll()
  const intervalMinutes = Number.parseInt(settings.autoBackupsInterval)

  await chrome.alarms.clear(AUTO_BACKUP_ALARM)

  if (intervalMinutes > 0) {
    chrome.alarms.create(AUTO_BACKUP_ALARM, {
      periodInMinutes: intervalMinutes
    })
  }
}

export default runInterval