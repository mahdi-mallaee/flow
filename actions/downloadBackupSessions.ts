import type { Backup } from "~utils/types"

/*
  uses Blob to create a json file for downloading backup and uploading it to extension later
  or for sharing the backup
*/

const downloadBackupSessions = async (backup: Backup) => {
  const jsonString = JSON.stringify(backup)

  const blob = new Blob([jsonString], { type: "application/json" })

  const url = URL.createObjectURL(blob)
  
  // TODO: handling all illegal characters for using in file name
  let title = backup.title.replaceAll('/', '_')
  title = title.replaceAll(':', '_')

  await chrome.downloads.download({
    url: url,
    filename: title + '.json'
  })
}

export default downloadBackupSessions