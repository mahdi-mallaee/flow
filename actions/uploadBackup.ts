import type { Backup } from "~utils/types"
import createNewBackup from "./createNewBackup"

const uploadBackup = (file: File) => {
  const reader = new FileReader()
  reader.onload = function (event) {
    const data: Backup = JSON.parse(event.target.result.toString())
    createNewBackup({ status: 'upload', sessions: data.sessions, title: data.title })
  }
  reader.readAsText(file)
}

export default uploadBackup