import { useState } from "react"
import './index.scss'
import './utils/colors.scss'
import createNewSession from "~actions/createNewSession"
import openSession from "~actions/openSession"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import getUnsavedWindows from "~actions/getUnsavedWindows"
import type { Session } from "~utils/types"
import isSessionOpen from "~actions/isSessionOpen"
import SessionCard from "~components/SessionCard"
import { MdAdd, MdDone, MdClose, MdTune } from 'react-icons/md'
import Logo from "~components/Logo"
import ThemeProvider from "~components/ThemeProvider"

function IndexPopup() {
  const [sessionTitleInput, setSessionTitleInput] = useState('')
  const [gettingSessionName, setGettingSessionName] = useState(false)
  const [sessions, setSessions] = useStorage<Session[]>({
    key: "sessions",
    instance: new Storage({
      area: "local"
    })
  }, [])
  const [unsavedWindows, setUnsavedWindows] = useStorage<chrome.windows.Window[]>({
    key: "unsaved-windows",
    instance: new Storage({
      area: "local"
    })
  }, [])

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
    console.log(isOpen)
    if (!isOpen) {
      const newSessions = await openSession(sessions, sessionId)
      await setSessions(newSessions)
      await refreshUnsavedWindows(newSessions)
      refreshUnsavedWindows()
    }
  }

  const addAsSessionButtonClickHandler = async (window: chrome.windows.Window) => {
    const newSession = await createNewSession(window.id)
    await setSessions(current => { return [...current, newSession] })
    refreshUnsavedWindows([...sessions, newSession])
  }

  const refreshUnsavedWindows = async (newSessions?: Session[]) => {
    const windows = await getUnsavedWindows(newSessions || sessions)
    setUnsavedWindows(windows)
  }

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

  return (
    <ThemeProvider>
      <div className="main-view">
        <div className="header">
          <div className="logo"><Logo /></div>
          <div className='title'>Future Tabs</div>
          <div className="settings-button"><MdTune /></div>
        </div>

        <div className='session-title'>Sessions</div>

        <div className='sessions-container'>
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
        </div>

        <button onClick={() => {
          console.log(sessions)
        }}>log sessions</button>

        {unsavedWindows.length >= 1 &&
          <div className="unsaved-windows-title">Unsaved Windows</div>
        }

        <div className="unsaved-windows-container">
          {unsavedWindows.map(window => {
            return <div key={window.id} className='unsaved-window'>
              <div className="title">Unsaved Window ( {window.id} )</div>
              <div className='add-as-session-button' onClick={() => { addAsSessionButtonClickHandler(window) }}>Add<MdAdd /></div>
            </div>
          })}
        </div>

      </div >
    </ThemeProvider>
  )
}

export default IndexPopup
