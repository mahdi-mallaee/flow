import { MdDelete, MdDownload } from "react-icons/md"
import store from "~store"
import type { Backup } from "~utils/types"
import './BackupCard.scss'
import actions from "~actions"
import useAlertMessage from "~hooks/useAlertMessage"

const BackupCard = (
  { backup, loaded, setLoadedBackupId }:
    { backup: Backup, loaded: boolean, setLoadedBackupId: React.Dispatch<React.SetStateAction<string>> }
) => {

  const { showAlert, renderAlert } = useAlertMessage()

  const removeBackup = async (id: string) => {
    const result = await store.backups.remove(id)
    if (!result) {
      showAlert({ text: 'Backup removal failed', type: 'error' })
    }
  }

  const _loadBackup = async (id: string) => {
    const result = await store.backups.load(id)
    if (!result) {
      showAlert({ text: 'Backup loading failed', type: 'error' })
      return
    }
    setLoadedBackupId(backup.id)
  }

  const downloadBackupHandler = async (backup: Backup) => {
    const result = await actions.backup.download(backup)
    if (!result) {
      showAlert({ text: 'Backup download failed', type: 'error' })
    }
  }

  return (
    <div className="backup-card">
      {renderAlert()}
      <div className="details">
        <div className="title">{backup.title}</div>
        <div className="status">{backup.status}</div>
        {backup.relatedItem && <div className="related-item">related {backup.relatedItem.type === 'session' ? 'session' : 'backup'}: {backup.relatedItem.title}</div>}
        <div className="date">{backup.date}</div>
      </div>
      <div className="buttons">
        <div className={loaded ? "load-backup loaded" : "load-backup"}
          onClick={() => _loadBackup(backup.id)}>
          {loaded ? 'Loaded !' : 'Load'}
        </div>
        <div className="download-backup" onClick={() => downloadBackupHandler(backup)}><MdDownload /></div>
        <div className="remove-backup" onClick={() => removeBackup(backup.id)}><MdDelete /></div>
      </div>
    </div>
  )
}

export default BackupCard