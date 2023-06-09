import { useState } from "react"
import './index.scss'
import createNewSession from "~actions/createNewSession"
import storageGetSesstion from "~store/storageGetSesstion"
import openSession from "~actions/openSession"
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"

function IndexPopup() {
  const [showTitleInputDialog, setShowTitleInputDialog] = useState(false)
  const [sessionTitleInput, setSessionTitleInput] = useState('')
  const [sessions, setSessions] = useStorage({
    key: "sessions",
    instance: new Storage({
      area: "local"
    })
  }, [])
  // const [unsavedWindows, setUnsavedWindows] = useStorage({
  //   key: "unsaved-windows",
  //   instance: new Storage({
  //     area: "local"
  //   })
  // }, [])

  const newSessionClickHandler = () => {
    setShowTitleInputDialog(true)
  }

  const _createNewSession = async () => {
    const newSession = await createNewSession(0, [], sessionTitleInput)
    await setSessions(current => {
      return [...current, newSession]
    })
    setShowTitleInputDialog(false)
    setSessionTitleInput('')
  }

  const sessionClickHandler = async (sessionId: string) => {
    const newSessions = await openSession(sessions, sessionId)
    await setSessions(newSessions)
  }

  // const addAsSessionButtonClickHandler = async (window: chrome.windows.Window) => {
  //   const newSession = await createNewSession(window.id)
  //   await setSessions(current => { return [...current, newSession] })
  // }

  const clearStorage = () => {
    setSessions([])
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

        <div className='session-title-container'>
          <span className='session-title-text'>Sessions</span>
          <button onClick={newSessionClickHandler} className='new-session-button'>new +</button>
        </div>

        <div className='sessions-container'>
          {sessions.map(session => {
            return <div key={session.id} className='session' onClick={() => { sessionClickHandler(session.id) }}>
              <div className="title">{session.title}</div>
              <div className="tabs-count">{session.tabs.length} tabs</div>
            </div>
          })}
        </div>
        {/* <div className="unsaved-windows-container">
          {unsavedWindows.map(window => {
            return <div key={window.id} className='unsaved-window'>
              <div className="title">Unsaved Window {window.id}</div>
              <button className='add-as-session-button' onClick={() => { addAsSessionButtonClickHandler(window) }}>add +</button>
            </div>
          })}
        </div> */}

        <button onClick={() => { clearStorage() }}>delete</button>
        <button onClick={() => {
          storageGetSesstion()
            .then(sessions => {
              console.log(sessions)
            })
        }}>log storage</button>
      </div >
    </>
  )
}

export default IndexPopup
