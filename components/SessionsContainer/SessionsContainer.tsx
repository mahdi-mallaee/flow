import { MdAdd, MdClose, MdDone } from "react-icons/md"
import createNewSession from "~actions/createNewSession"
import openSession from "~actions/openSession"
import SessionCard from "~components/SessionCard"
import refreshUnsavedWindows from "~actions/refreshUnsavedWindows"
import type { AlertMessage, Session } from "~utils/types"
import { useEffect, useState } from "react"
import AlertMessageView from "~components/AlertMessage/AlertMessage"
import './SessionsContainer.scss'
import { AnimatePresence, motion } from "framer-motion"
import createNewBackup from "~actions/createNewBackup"

const SessionsContainer = ({ sessions, setSessions }: { sessions: Session[], setSessions: Function }) => {
  const [sessionTitleInput, setSessionTitleInput] = useState('')
  const [gettingSessionName, setGettingSessionName] = useState(false)
  const [message, setMessage] = useState<AlertMessage>({
    show: false,
    text: '',
    type: 'info'
  })

  const [initialAnimation, setInitialAnimation] = useState(false)

  const mainButtonClickHandler = (id: string) => {
    const newSessions = sessions.map(session => {
      if (session.id === id) {
        session.main = !session.main
      } else {
        session.main = false
      }
      return session
    })
    setSessions(newSessions)
  }

  const deleteSession = (session: Session) => {
    createNewBackup({
      status: 'before deleting session',
      relatedItem: {
        title: session.title,
        type: 'session'
      },
      sessions
    })
    const newSessions = [...sessions]
    const index = newSessions.findIndex(s => s.id === session.id)
    newSessions.splice(index, 1)
    setSessions(newSessions)
    refreshUnsavedWindows(newSessions)
  }

  const editSession = async (id: string, title: string, callBack: Function) => {
    const newSesssions = sessions.map(s => {
      if (s.id === id) {
        s.title = title
      }
      return s
    })
    await setSessions(newSesssions)
    callBack()
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

    const newSession = await createNewSession(0, [], sessionTitleInput)
    await setSessions(current => {
      return [newSession, ...current]
    })
    setGettingSessionName(false)
    setSessionTitleInput('')
    refreshUnsavedWindows([...sessions, newSession])
  }

  const sessionClickHandler = async (session: Session) => {
    if (!session.isOpen) {
      const newSessions = await openSession(sessions, session.id, true)
      await setSessions(newSessions)
      await refreshUnsavedWindows(newSessions)
    } else {
      setMessage({
        show: true,
        text: 'This session is already open.',
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
      <AlertMessageView message={message} setMessage={setMessage} />

      <div className='sessions-container'>
        <div className='view-title session-title'>Sessions</div>
        <div className="sessions">
          {gettingSessionName ?
            <div className="get-session-title-container">
              <input autoFocus type="text" value={sessionTitleInput} onChange={e => {
                setSessionTitleInput(e.target.value)
              }} name="session-title-input" placeholder={new Date().toUTCString()} onKeyDown={(e) => {
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