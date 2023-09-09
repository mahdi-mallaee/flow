import { MdDelete, MdDownload } from "react-icons/md"
import downloadBackupSessions from "~actions/downloadBackupSessions"
import Store from "~store"
import type { Backup } from "~utils/types"
import './BackupCard.scss'

const BackupCard = (
  { backup, loaded, setLoadedBackupId }:
    { backup: Backup, loaded: boolean, setLoadedBackupId: React.Dispatch<React.SetStateAction<string>> }
) => {
  const removeBackup = (id: string) => {
    Store.backups.delete(id)
  }

  const _loadBackup = async (id: string) => {
    await Store.backups.load(id)
    setLoadedBackupId(backup.id)
  }

  return (
    <div className="backup-card">
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
        <div className="download-backup" onClick={() => downloadBackupSessions(backup)}><MdDownload /></div>
        <div className="remove-backup" onClick={() => removeBackup(backup.id)}><MdDelete /></div>
      </div>
    </div>
  )
}

export default BackupCard