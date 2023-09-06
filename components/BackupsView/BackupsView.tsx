import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { StoreKeys, type Backup } from "~utils/types"
import './BackupsView.scss'
import { useEffect, useState } from "react"
import { MdAdd, MdClose, MdDelete, MdDone, MdDownload, MdUploadFile } from "react-icons/md"
import createNewBackup from "~actions/createNewBackup"
import Store from "~store"
import { AnimatePresence, motion } from "framer-motion"
import downloadBackupSessions from "~actions/downloadBackupSessions"
import uploadBackup from "~actions/uploadBackup"
import { INPUT_MAX_LENGTH } from "~utils/constants"

const BackupsView = ({ }) => {

  const [backups] = useStorage<Backup[]>({
    key: StoreKeys.backups,
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

  const removeBackup = (id: string) => {
    Store.backups.delete(id)
  }

  const _loadBackup = async (id: string) => {
    await Store.backups.load(id)
    setLoadedBackupId(id)
  }

  const [initialAnimation, setInitialAnimation] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setInitialAnimation(true)
    }, 200)
  }, [])

  return (
    <div className="backups-view">
      <div className='view-title backups-title'>Backups</div>
      <div className="backups-container">
        {getBackupName ?
          <div className="get-backup-title-container">
            <input maxLength={INPUT_MAX_LENGTH} autoFocus type="text" value={backupTitleInput} onChange={e => {
              setBackupTitleInput(e.target.value)
            }} name="backup-title-input" placeholder={new Date().toLocaleString()} onKeyDown={(e) => {
              if (e.key === "Enter") {
                _createNewBackup()
              }
            }} />
            <div className='close-get-title-button' onClick={() => {
              setGetBackupName(false)
              setBackupTitleInput('')
            }}><MdClose /></div>
            <div className='confirm-title-button' onClick={() => _createNewBackup()}><MdDone /></div>
          </div>
          :
          <div className="new-backup-button" onClick={() => setGetBackupName(true)}><MdAdd /> <span>create new backup</span></div>
        }
        <div className="file-input-container">
          <label htmlFor="file-input" className="custom-file-input"><MdUploadFile /><span>Upload A Local Backup</span></label>
          <input type="file" id="file-input" accept=".json" onChange={(event) => uploadBackup(event.target.files[0])} />
        </div>
        <AnimatePresence>
          {
            backups.map(backup => {
              return (
                <motion.div key={backup.id} className="backup-card"
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  initial={{ opacity: initialAnimation ? 0 : 1, height: initialAnimation ? 0 : 'auto' }}
                  transition={{ duration: 0.2 }}>
                  <div className="container">
                    <div className="details">
                      <div className="title">{backup.title}</div>
                      <div className="status">{backup.status}</div>
                      {backup.relatedItem && <div className="related-item">related {backup.relatedItem.type === 'session' ? 'session' : 'backup'}: {backup.relatedItem.title}</div>}
                      <div className="date">{backup.date}</div>
                    </div>
                    <div className="buttons">
                      <div className={backup.id === loadedBackupId ? "load-backup loaded" : "load-backup"}
                        onClick={() => _loadBackup(backup.id)}>
                        {backup.id === loadedBackupId ? 'Loaded !' : 'Load'}
                      </div>
                      <div className="download-backup" onClick={() => downloadBackupSessions(backup)}><MdDownload /></div>
                      <div className="remove-backup" onClick={() => removeBackup(backup.id)}><MdDelete /></div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          }
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BackupsView