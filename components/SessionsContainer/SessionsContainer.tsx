import { MdAdd, MdClose, MdDone } from "react-icons/md"
import createNewSession from "~actions/createNewSession"
import isSessionOpen from "~actions/isSessionOpen"
import openSession from "~actions/openSession"
import SessionCard from "~components/SessionCard"
import refreshUnsavedWindows from "~actions/refreshUnsavedWindows"
import type { AlertMessage, Session } from "~utils/types"
import { useState } from "react"
import AlertMessageView from "~components/AlertMessage/AlertMessage"
import './SessionsContainer.scss'


const SessionsContainer = ({ sessions, setSessions }: { sessions: Session[], setSessions: Function }) => {
  const [sessionTitleInput, setSessionTitleInput] = useState('')
  const [gettingSessionName, setGettingSessionName] = useState(false)
  const [message, setMessage] = useState<AlertMessage>({
    show: false,
    text: '',
    type: 'info'
  })

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

  const deleteSession = (id: string) => {
    const newSessions = sessions
    const index = newSessions.findIndex(s => s.id === id)
    newSessions.splice(index, 1)
    setSessions([...newSessions])
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
    if (duplicateSession) { return }

    const newSession = await createNewSession(0, [], sessionTitleInput)
    await setSessions(current => {
      return [...current, newSession]
    })
    setGettingSessionName(false)
    setSessionTitleInput('')
    refreshUnsavedWindows([...sessions, newSession])
  }

  const sessionClickHandler = async (sessionId: string) => {
    const isOpen = await isSessionOpen(sessions, sessionId)
    if (!isOpen) {
      const newSessions = await openSession(sessions, sessionId, true)
      await setSessions(newSessions)
      await refreshUnsavedWindows(newSessions)
      refreshUnsavedWindows()
    } else {
      setMessage({
        show: true,
        text: 'This session is already open.',
        type: 'info'
      })
    }
  }

  return (
    <>
      <AlertMessageView message={message} setMessage={setMessage} />

      <div className='sessions-container'>
        <div className='session-title'>Sessions</div>
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
        {sessions.map(session => {
          return <SessionCard
            key={session.id}
            session={session}
            sessionClickHandler={sessionClickHandler}
            mainButtonClickHandler={mainButtonClickHandler}
            deleteSession={deleteSession}
            editSession={(id: string, title: string, callBack: Function) => {
              editSession(id, title, callBack)
            }} />
        })}
      </div>
    </>
  )
}

export default SessionsContainer