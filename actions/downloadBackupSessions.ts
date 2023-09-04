import type { Backup } from "~utils/types"

const downloadBackupSessions = async (backup: Backup) => {
  const jsonString = JSON.stringify(backup)

  const blob = new Blob([jsonString], { type: "application/json" })

  const url = URL.createObjectURL(blob)
  let title = backup.title.replaceAll('/', '_')
  title = title.replaceAll(':', '_')

  await chrome.downloads.download({
    url: url,
    filename: title
  })
}

export default downloadBackupSessions