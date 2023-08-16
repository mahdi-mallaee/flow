import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import type { Backup, Session } from "~utils/types"
import './BackupsView.scss'
import { useState } from "react"
import { MdAdd, MdClose, MdDelete, MdDone } from "react-icons/md"
import createNewBackup from "~actions/createNewBackup"

const BackupsView = ({ }) => {
  const [_, setSessions] = useStorage<Session[]>({
    key: "sessions",
    instance: new Storage({
      area: "local"
    })
  }, [])

  const [backups, setBackups] = useStorage<Backup[]>({
    key: "backups",
    instance: new Storage({
      area: "local"
    })
  }, [])

  const [getBackupName, setGetBackupName] = useState(false)
  const [backupTitleInput, setBackupTitleInput] = useState('')
  const [loadedBackupId, setLoadedBackupId] = useState('')

  const _createNewBackup = async () => {
    await createNewBackup({
      status: 'manual',
      title: backupTitleInput
    })
    setGetBackupName(false)
    setBackupTitleInput('')
  }

  const loadBackup = async (id: string) => {
    const backup = backups.find(b => b.id === id)
    if (backup) {
      await createNewBackup({
        status: 'before loading backup',
        relatedItem: {
          title: backup.title,
          type: 'backup'
        }
      })
      await setSessions(backup.sessions)
    }
  }

  const removeBackup = (id: string) => {
    const index = backups.findIndex(b => b.id === id)
    const newBackups = backups
    newBackups.splice(index, 1)
    setBackups([...newBackups])
  }

  return (
    <div className="backups-view">
      <div className='view-title backups-title'>Backups</div>
      <div className="backups-container">
        {getBackupName ?
          <div className="get-backup-title-container">
            <input autoFocus type="text" value={backupTitleInput} onChange={e => {
              setBackupTitleInput(e.target.value)
            }} name="backup-title-input" placeholder={new Date().toUTCString()} onKeyDown={(e) => {
              if (e.key === "Enter") {
                _createNewBackup()
              }
            }} />
            <div className='close-get-title-button' onClick={() => setGetBackupName(false)}><MdClose /></div>
            <div className='confirm-title-button' onClick={() => _createNewBackup()}><MdDone /></div>
          </div>
          :
          <div className="new-backup-button" onClick={() => setGetBackupName(true)}><MdAdd /> <span>create new backup</span></div>
        }
        {
          backups.map(backup => {
            return (
              <div key={backup.id} className="backup-card">
                <div className="details">
                  <div className="title">{backup.title}</div>
                  <div className="status">{backup.status}</div>
                  {backup.relatedItem && <div className="related-item">related {backup.relatedItem.type === 'session' ? 'session' : 'backup'}: {backup.relatedItem.title}</div>}
                  <div className="date">{backup.date}</div>
                </div>
                <div className="buttons">
                  <div className={backup.id === loadedBackupId ? "load-backup loaded" : "load-backup"} onClick={() => {
                    loadBackup(backup.id)
                      .then(() => setLoadedBackupId(backup.id))
                  }}>{backup.id === loadedBackupId ? 'Loaded !' : 'Load'}</div>
                  <div className="remove-backup" onClick={() => removeBackup(backup.id)}><MdDelete /></div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default BackupsView