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

function IndexPopup() {
  const [showTitleInputDialog, setShowTitleInputDialog] = useState(false)
  const [sessionTitleInput, setSessionTitleInput] = useState('')
  const [gettingSessionName, setGettingSessionName] = useState(false)
  const [sessions, setSessions] = useStorage({
    key: "sessions",
    instance: new Storage({
      area: "local"
    })
  }, [])
  const [unsavedWindows, setUnsavedWindows] = useStorage({
    key: "unsaved-windows",
    instance: new Storage({
      area: "local"
    })
  }, [])

  const newSessionClickHandler = () => {
    setGettingSessionName(true)
  }

  const _createNewSession = async () => {
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
      refreshUnsavedWindows(newSessions)
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
  }

  return (
    <>
      {showTitleInputDialog &&
        <div className="session-title-dialog">
          <div className="scrim" onClick={() => {
            setShowTitleInputDialog(false)
          }}></div>
          <div className="dialog-container">
            <div className="dialog-text">Insert a title for the new session.</div>
            <input type="text" className="session-title-input" placeholder={'New Session - ' + new Date().toUTCString()} value={sessionTitleInput} onChange={(e) => {
              setSessionTitleInput(e.target.value)
            }} />
            <div className="dialog-buttons-container">
              <button className="cancel-session-creation-button" onClick={() => {
                setShowTitleInputDialog(false)
              }}>cancel</button>
              <button className="create-new-session-button" onClick={_createNewSession}>create</button>
            </div>
          </div>
        </div>
      }

      <div className="main-view">
        <h2 className='title'>Future Tabs</h2>

        <div className='session-title'>Sessions</div>

        <div className='sessions-container'>
          {sessions.map(session => {
            return <div key={session.id} className='session' onClick={() => {
              sessionClickHandler(session.id)
            }}>
              <div className="tabs-count">{session.tabs.length}</div>
              {session.main && <div className="main-indicator">M</div>}
              <div className="title">{session.title}</div>
              <button className="main-button" onClick={e => {
                mainButtonClickHandler(session.id)
                e.stopPropagation()
              }}>main</button>
              <button className="delete-session-button" onClick={e => {
                deleteSession(session.id)
                e.stopPropagation()
              }}>del</button>
            </div>
          })}
          {gettingSessionName ?
            <div className="get-session-title-container">
              <input type="text" value={sessionTitleInput} onChange={e => {
                setSessionTitleInput(e.target.value)
              }} name="session-title-input" placeholder={new Date().toUTCString()} />
              <button onClick={() => setGettingSessionName(false)}>cancel</button>
              <button onClick={() => _createNewSession()}>add</button>
            </div>
            :
            <div className="new-session-button" onClick={newSessionClickHandler}>+ Add new session</div>
          }
        </div>

        {unsavedWindows.length >= 1 &&
          <div className="unsaved-windows-title">Unsaved Windows</div>
        }

        <div className="unsaved-windows-container">
          {unsavedWindows.map(window => {
            return <div key={window.id} className='unsaved-window'>
              <div className="title">Unsaved Window {window.id}</div>
              <div className='add-as-session-button' onClick={() => { addAsSessionButtonClickHandler(window) }}>Add +</div>
            </div>
          })}
        </div>

      </div >
    </>
  )
}

export default IndexPopup
