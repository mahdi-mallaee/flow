import type { Backup } from "~utils/types"
import logger from "~utils/logger"

const download = async (backup: Backup): Promise<boolean> => {
  const backupJsonString = JSON.stringify(backup)
  let downloadUrl: string
  try {
    const blob = new Blob([backupJsonString], { type: "application/json" })
    downloadUrl = URL.createObjectURL(blob)
  } catch (error) {
    logger.error('ERROR: could not create the backup blob -> actions/backup/download', error)
    return false
  }

  const fileName = 'Backup_' + backup.id

  try {
    await chrome.downloads.download({
      url: downloadUrl,
      filename: fileName + '.json'
    })
    setTimeout(() => {
      URL.revokeObjectURL(downloadUrl)
    }, 10000)
    return true
  } catch (error) {
    logger.error('ERROR: could not download the backup -> actions/backup/download', error)
    URL.revokeObjectURL(downloadUrl)
    return false
  }
}

export default download