import type { Backup } from "~utils/types"

const downloadBackup = async (backup: Backup) => {
  const backupJsonString = JSON.stringify(backup)

  const blob = new Blob([backupJsonString], { type: "application/json" })

  const downloadUrl = URL.createObjectURL(blob)

  const fileName = 'Backup_' + backup.id

  await chrome.downloads.download({
    url: downloadUrl,
    filename: fileName + '.json'
  })
}

export default downloadBackup