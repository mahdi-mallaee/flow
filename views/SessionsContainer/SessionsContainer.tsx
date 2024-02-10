import { MdAdd, MdClose, MdDone } from "react-icons/md"
import SessionCard from "~components/SessionCard"
import { type Session } from "~utils/types"
import { useEffect, useState } from "react"
import './SessionsContainer.scss'
import { AnimatePresence, motion } from "framer-motion"
import store from "~store"
import useSessions from "~hooks/useSessions"
import useSettings from "~hooks/useSettings"
import useAlertMessage from "~hooks/useAlertMessage"
import { INPUT_MAX_LENGTH } from "~utils/constants"
import actions from "~actions"

const SessionsContainer = () => {
  const [sessionTitleInput, setSessionTitleInput] = useState('')
  const [gettingSessionName, setGettingSessionName] = useState(false)
  const { showAlert, renderAlert } = useAlertMessage()

  const settings = useSettings()
  const sessions = useSessions()

  const [initialAnimation, setInitialAnimation] = useState(false)

  const mainButtonClickHandler = (id: string) => {
    store.sessions.setAsMain(id)
  }

  const deleteSession = async (session: Session) => {
    if (settings.createBackupBeforeSessionDelete) {
      actions.backup.create({
        status: 'before deleting session',
        relatedItem: {
          title: session.title,
          type: 'session'
        }
      })
    }
    await store.sessions.delete(session.id)
    actions.window.refreshUnsavedWindows()
  }

  const editSession = async (id: string, title: string, callBack: Function) => {
    if (title) {
      const duplicateSession = sessions.find(s => s.title === title)
      if (duplicateSession) {
        showAlert({
          text: 'Another session with this name already exists',
          type: 'info'
        })
        return
      }

      await store.sessions.editTitle(id, title)
    }
    callBack()
  }

  const newSessionClickHandler = () => {
    setGettingSessionName(true)
  }

  const _createNewSession = async () => {
    const duplicateSession = sessions.find(s => s.title === sessionTitleInput)
    if (duplicateSession) {
      showAlert({
        text: 'Another session with this name already exists',
        type: 'info'
      })
      return
    }

    await actions.session.create({ title: sessionTitleInput })

    setGettingSessionName(false)
    setSessionTitleInput('')
  }

  const sessionClickHandler = async (session: Session) => {
    if (!session.isOpen) {
      await actions.session.open(session.id)
    } else {
      showAlert({
        text: 'This session is already open',
        type: 'info'
      })
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setInitialAnimation(true)
    }, 200)
  }, [])

  return (
    <>
      {renderAlert()}

      <div className='sessions-container'>
        <div className='view-title session-title'>Sessions</div>
        <div className="sessions">
          {gettingSessionName ?
            <div className="get-session-title-container">
              <input maxLength={INPUT_MAX_LENGTH} autoFocus type="text" value={sessionTitleInput} onChange={e => {
                setSessionTitleInput(e.target.value)
              }} name="session-title-input" placeholder={new Date().toLocaleString()} onKeyDown={(e) => {
                if (e.key === "Enter") {
                  _createNewSession()
                }
              }} />
              <div className='close-get-title-button' onClick={() => setGettingSessionName(false)}><MdClose /></div>
              <div className='confirm-title-button' onClick={() => _createNewSession()}><MdDone /></div>
            </div>
            :
            <div className="new-session-button" onClick={newSessionClickHandler}><MdAdd /> <span>Add new session</span></div>
          }

          <AnimatePresence>
            {sessions.map(session => {
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: initialAnimation ? 0 : 1, height: initialAnimation ? 0 : 'auto' }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}>
                  <SessionCard
                    key={session.id}
                    session={session}
                    sessionClickHandler={sessionClickHandler}
                    mainButtonClickHandler={mainButtonClickHandler}
                    deleteSession={deleteSession}
                    editSession={(id: string, title: string, callBack: Function) => {
                      editSession(id, title, callBack)
                    }} />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default SessionsContainer