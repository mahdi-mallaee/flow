import { MdAdd, MdClose, MdDone } from "react-icons/md"
import createNewSession from "~actions/createNewSession"
import openSession from "~actions/openSession"
import SessionCard from "~components/SessionCard"
import refreshUnsavedWindows from "~actions/refreshUnsavedWindows"
import { StoreKeys, type AlertMessage, type Session, type Settings, SessionsKeys, type BasicSession } from "~utils/types"
import { useEffect, useState } from "react"
import AlertMessageView from "~components/AlertMessage/AlertMessage"
import './SessionsContainer.scss'
import { AnimatePresence, motion } from "framer-motion"
import createNewBackup from "~actions/createNewBackup"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import Store from "~store"
import useSessions from "~hooks/useSessions"

const SessionsContainer = ({ settings }: { settings: Settings }) => {
  const [sessionTitleInput, setSessionTitleInput] = useState('')
  const [gettingSessionName, setGettingSessionName] = useState(false)
  const [message, setMessage] = useState<AlertMessage>({
    show: false,
    text: '',
    type: 'info'
  })

  const sessions = useSessions()

  const [initialAnimation, setInitialAnimation] = useState(false)

  const mainButtonClickHandler = (id: string) => {
    // const newSessions = sessions.map(session => {
    //   if (session.id === id) {
    //     session.main = !session.main
    //   } else {
    //     session.main = false
    //   }
    //   return session
    // })
  }

  const deleteSession = (session: Session) => {
    if (settings.createBackupBeforeSessionDelete) {
      createNewBackup({
        status: 'before deleting session',
        relatedItem: {
          title: session.title,
          type: 'session'
        },
        sessions
      })
    }
    Store.sessions.delete(session.id)
  }

  const editSession = async (id: string, title: string, callBack: Function) => {
    // const newSesssions = sessions.map(s => {
    //   if (s.id === id) {
    //     s.title = title
    //   }
    //   return s
    // })
    // callBack()
  }

  const newSessionClickHandler = () => {
    setGettingSessionName(true)
  }

  const _createNewSession = async () => {
    const duplicateSession = sessions.find(s => s.title === sessionTitleInput)
    if (duplicateSession) {
      setMessage({
        show: true,
        text: 'Another session with this name already exists.',
        type: 'info'
      })
      return
    }

    await createNewSession(0, [], sessionTitleInput)

    setGettingSessionName(false)
    setSessionTitleInput('')
  }

  const sessionClickHandler = async (session: Session) => {
    await openSession(session.id)
  }

  useEffect(() => {
    setTimeout(() => {
      setInitialAnimation(true)
    }, 200)
  }, [])

  return (
    <>
      <AlertMessageView message={message} setMessage={setMessage} />

      <div className='sessions-container'>
        <div className='view-title session-title'>Sessions</div>
        <div className="sessions">
          {gettingSessionName ?
            <div className="get-session-title-container">
              <input autoFocus type="text" value={sessionTitleInput} onChange={e => {
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