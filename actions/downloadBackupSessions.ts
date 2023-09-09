import type { Backup } from "~utils/types"

const downloadBackupSessions = async (backup: Backup) => {
  const backupJsonString = JSON.stringify(backup)

  const blob = new Blob([backupJsonString], { type: "application/json" })

  const downloadUrl = URL.createObjectURL(blob)

  // TODO: handling all illegal characters for using in file name
  let fileName = backup.title.replaceAll('/', '_')
  fileName = fileName.replaceAll(':', '_')

  await chrome.downloads.download({
    url: downloadUrl,
    filename: fileName + '.json'
  })
}

export default downloadBackupSessions