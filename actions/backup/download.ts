import type { Backup } from "~utils/types"

/**
 * Downloads a backup file to the user's local machine.
 *
 * @param backup - The backup object to be downloaded.
 * @returns `true` if the download was successful, `false` otherwise.
 */
const download = async (backup: Backup): Promise<boolean> => {
  const backupJsonString = JSON.stringify(backup)
  let downloadUrl: string
  try {
    const blob = new Blob([backupJsonString], { type: "application/json" })
    downloadUrl = URL.createObjectURL(blob)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR: could not create the backup blob -> store/backup/download l.7', error)
    }
    return false
  }

  const fileName = 'Backup_' + backup.id

  try {
    await chrome.downloads.download({
      url: downloadUrl,
      filename: fileName + '.json'
    })
    return true
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR: could not download the backup -> store/backup/download l.19', error)
    }
    return false
  }
}

export default download