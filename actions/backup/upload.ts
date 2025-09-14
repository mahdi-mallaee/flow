import actions from "~actions"
import type { Backup } from "~utils/types"

/**
 * @param file - The file to be uploaded, expected to be a JSON file including an array of sessions.
 * @param onError - A callback function to handle errors during the upload process.
 *    It will show alert message in the BackupContainer view
 * @param onSuccess - A callback function to be called when the upload is successful.
 */
const upload = (file: File, onError?: (msg: string) => void, onSuccess?: () => void) => {
  const reader = new FileReader()
  reader.onload = function (event) {
    try {
      const data: Backup = JSON.parse(event.target.result.toString())
      if (checkFile(data, onError)) {
        actions.backup.create({ status: 'upload', sessions: data.sessions, title: data.title })
          .then(result => {
            if (!result) {
              onError('Backup creation failed')
            }else{
              onSuccess()
            }
          })
      }
    } catch {
      onError('File is not in JSON format')
    }

  }
  reader.readAsText(file)
}

const checkFile = (data: Backup, onError: (msg: string) => void): boolean => {
  if (typeof data === 'undefined') {
    onError("Couldn't read the file")
    return false
  }

  // checks to see if session is an array and has a title
  if (!(data.sessions || typeof data.sessions.length !== 'number' || typeof data.title !== 'string')) {
    onError("Backup format is not correct")
    return false
  }

  // checks to see if every session's data is in the correct format
  let validSessions = true
  for (const session of data.sessions) {
    if (
      typeof session.id !== 'string' ||
      !session.tabs ||
      typeof session.tabs.length !== 'number' ||
      typeof session.title !== 'string'
    ) {
      validSessions = false
    }
  }

  if (!validSessions) {
    onError('Sessions are not in correct format')
    return false
  }

  return true
}

export default upload