import { MdAdd, MdClose, MdDone } from "react-icons/md"
import SessionCard from "~components/SessionCard"
import { type Session } from "~utils/types"
import { useRef, useState, type MouseEvent } from "react"
import './SessionsContainer.scss'
import { Reorder, } from "framer-motion"
import store from "~store"
import useSessions from "~hooks/useSessions"
import useSettings from "~hooks/useSettings"
import useAlertMessage from "~hooks/useAlertMessage"
import { INPUT_MAX_LENGTH } from "~utils/constants"
import actions from "~actions"
import checkNumberLimit from "~actions/session/checkNumberLimit"

const SessionsContainer = () => {
  const [sessionTitleInput, setSessionTitleInput] = useState('')
  const [gettingSessionName, setGettingSessionName] = useState(false)
  const { showAlert, renderAlert } = useAlertMessage()

  const settings = useSettings()
  const sessions = useSessions()

  const dragConstarintRef = useRef<HTMLUListElement>()

  const mainButtonClickHandler = (id: string) => {
    store.sessions.basicUpdate(id, { main: true })
  }

  const deleteSession = async (session: Session) => {
    if (settings.createBackupBeforeSessionDelete) {
      const result = await actions.backup.create({
        status: 'before deleting session',
        relatedItem: {
          title: session.title,
          type: 'session'
        }
      })

      if (!result) {
        showAlert({
          text: 'Backup creation failed',
          type: 'error'
        })
        return
      }
    }
    await store.sessions.remove(session.id)
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

      const result = await store.sessions.basicUpdate(id, { title })
      if (!result) {
        showAlert({ text: 'Session edit failed', type: 'error' })
        return
      }
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
    const checkLimit = await checkNumberLimit()
    if (!checkLimit) {
      showAlert({
        text: "You've reached session numbers limit!",
        type: 'warning'
      })
      return
    }

    let windowId = -1
    if (settings.createSessionInCurrentWindow) {
      windowId = (await chrome.windows.getCurrent()).id
    }

    const result = await actions.session.create({ windowId, title: sessionTitleInput, updateWindow: settings.createSessionInCurrentWindow })
    window.close()
    if (!result) {
      showAlert({ text: 'Session creation failed', type: 'error' })
    }

    setGettingSessionName(false)
    setSessionTitleInput('')
  }

  const sessionClickHandler = async (session: Session, e: MouseEvent) => {
    if (!session.isOpen) {
      // adding metaKey for mac users
      await actions.session.open(session.id, e.ctrlKey || e.metaKey)
      window.close()
    } else {
      showAlert({
        text: 'This session is already open',
        type: 'info'
      })
    }
  }

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

          {
            settings.showLargeSessionWarning &&
            sessions.findIndex(s => s.tabs.length > 30) >= 0 &&
            <div className="limit-number">
              Sessions with over 30 tabs will be slow!
              <MdClose onClick={() => store.settings.set({ showLargeSessionWarning: false })} />
            </div>
          }

          <Reorder.Group
            className="session-reorder-container"
            axis="y" values={sessions}
            onReorder={(newOrder) => { store.sessions.setAll(newOrder) }}
            ref={dragConstarintRef}>
            {sessions.map(session => {
              return (
                <SessionCard
                  key={session.id}
                  session={session}
                  sessionClickHandler={sessionClickHandler}
                  mainButtonClickHandler={mainButtonClickHandler}
                  deleteSession={deleteSession}
                  editSession={(id: string, title: string, callBack: Function) => {
                    editSession(id, title, callBack)
                  }}
                  dragConstarintRef={dragConstarintRef} />
              )
            })}
          </Reorder.Group >

        </div>

      </div>
    </>
  )
}

export default SessionsContainer