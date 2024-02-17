import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { StoreKeys, type Backup } from "~utils/types"
import './BackupsView.scss'
import { useEffect, useState } from "react"
import { MdAdd, MdClose, MdDeleteOutline, MdDone, MdUploadFile } from "react-icons/md"
import { AnimatePresence, motion } from "framer-motion"
import { BACKUP_NUMBER_LIMIT, INPUT_MAX_LENGTH } from "~utils/constants"
import BackupCard from "~components/BackupCard"
import useAlertMessage from "~hooks/useAlertMessage"
import actions from "~actions"
import store from "~store"

const BackupsView = ({ }) => {

  const [backups] = useStorage<Backup[]>({
    key: StoreKeys.backups,
    instance: new Storage({
      area: "local"
    })
  }, [])

  const { renderAlert, showAlert } = useAlertMessage()

  const [getBackupName, setGetBackupName] = useState(false)
  const [showDeleteBackups, setShowDeleteBackups] = useState(true)
  const [backupTitleInput, setBackupTitleInput] = useState('')
  const [loadedBackupId, setLoadedBackupId] = useState('')

  const _createNewBackup = async () => {
    await actions.backup.create({
      status: 'manual',
      title: backupTitleInput
    })
    setGetBackupName(false)
    setBackupTitleInput('')
  }

  const onUploadError = (msg: string) => {
    showAlert({ text: msg, type: 'error' })
  }

  const uploadBackupHandler = (file: File) => {
    actions.backup.upload(file, onUploadError)
  }

  const deleteAllBackupsHandler = () => {
    store.backups.removeAll()
  }

  const [initialAnimation, setInitialAnimation] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setInitialAnimation(true)
    }, 200)
  }, [])

  return (
    <div className="backups-view">
      {renderAlert()}
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
          <input type="file" id="file-input" accept=".json" onChange={(event) => uploadBackupHandler(event.target.files[0])} />
        </div>
        <div className="delete-all-backups-container">
          {showDeleteBackups ?
            <div className="delete-button" onClick={() => setShowDeleteBackups(false)}>
              <MdDeleteOutline></MdDeleteOutline>
              Delete All Backups
            </div>
            :
            <div className="confirmation-dialouge">
              <span>This action is irreversible. Are you sure?</span>
              <div className='close-delete-button' onClick={() => setShowDeleteBackups(true)}><MdClose /></div>
              <div className='confirm-delete-button' onClick={deleteAllBackupsHandler}><MdDone /></div>
            </div>
          }
        </div>
        <div>Only {BACKUP_NUMBER_LIMIT} recent backups will be saved.</div>
        <AnimatePresence>
          {
            backups.map(backup => {
              return (
                <motion.div key={backup.id}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  initial={{ opacity: initialAnimation ? 0 : 1, height: initialAnimation ? 0 : 'auto' }}
                  transition={{ duration: 0.2 }}>
                  <BackupCard backup={backup} loaded={loadedBackupId === backup.id} setLoadedBackupId={setLoadedBackupId} />
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