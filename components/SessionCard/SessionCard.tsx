import { useState, type MouseEvent } from "react";
import type { Session } from "~utils/types";
import './SessionCard.scss'
import { MdMoreVert, MdDone, MdClose, MdOutlineEdit, MdOutlineDelete, MdOutlinePushPin, MdPushPin, MdIcecream } from 'react-icons/md'
import { INPUT_MAX_LENGTH } from "~utils/constants";
import store from "~store";

type SessionCardArgs = {
  session: Session,
  sessionClickHandler: (session: Session, e: MouseEvent) => void,
  mainButtonClickHandler: (id: string) => void,
  deleteSession: (session: Session) => void,
  editSession: (id: string, title: string, callBack: Function) => void
}
type State = 'default' | 'title-edit' | 'delete-confirmation' | 'menu'

const SessionCard = (
  { session, sessionClickHandler, mainButtonClickHandler, deleteSession, editSession }: SessionCardArgs
) => {

  const [sessionTitleInput, setSessionTitleInput] = useState('')
  const [sessionCardState, setSessionCardState] = useState<State>('default')


  const defaultState = () => {
    return (
      <div className={session.isOpen ? 'session-container open' : 'session-container'}
        onClick={(e) => {
          sessionClickHandler(session, e)
        }}>
        <div className={`tabs-count color-${session.colorCode}`}>{session.tabs.length <= 99 ? session.tabs.length : "+"}</div>
        {session.main && <div className="main-indicator">M</div>}
        <div className="title">{session.title}</div>
        <div className="edit-title-button" onClick={e => {
          setSessionCardState('title-edit')
          e.stopPropagation()
        }}><MdOutlineEdit /></div>
        <div className="menu-session-button" onClick={e => {
          setSessionCardState('menu')
          e.stopPropagation()
        }}><MdMoreVert /></div>
      </div>
    )
  }

  const titleEditState = () => {
    const _editSession = () => {
      editSession(session.id, sessionTitleInput, () => {
        setSessionCardState('default')
        setSessionTitleInput('')
      })
    }
    return (
      <div className="edit-session-title-container">
        <input autoFocus maxLength={INPUT_MAX_LENGTH} onKeyDown={(e) => {
          if (e.key === "Enter") {
            _editSession()
          }
        }} type="text" id="edit-title-input" className="edit-title-input" placeholder={session.title} value={sessionTitleInput}
          onChange={e => {
            setSessionTitleInput(e.target.value)
          }} />
        <div className="confirm-edit-title-button" onClick={_editSession}><MdDone /></div>
      </div >
    )
  }

  const menuState = () => {
    return (
      <div className="menu-session-container">
        <div className="tabs-count">{session.tabs.length} Tabs</div>
        <div className={session.main ? "main-session-button main" : "main-session-button"}
          onClick={() => mainButtonClickHandler(session.id)}>
          {session.main ? <MdPushPin /> : <MdOutlinePushPin />}<span>Main</span>
        </div>
        <div className="buttons-container">
          <div onClick={() => {
            store.sessions.setOpenStatus(session.id, { freeze: !(session.freeze || false) })
          }}><MdIcecream /></div>
          <div className="delete-session-button" onClick={() => setSessionCardState('delete-confirmation')}><MdOutlineDelete /></div>
          <div className="close-menu-button" onClick={() => {
            setSessionCardState('default')
          }}><MdClose /></div>
        </div>
      </div>
    )
  }

  const deleteConfirmationState = () => {
    return (
      <div className="delete-confirmation-container">
        <div className="confirmation-text">Are you sure of deleting this session ?</div>
        <div className="close-confirmation-button" onClick={() => {
          setSessionCardState('default')
        }}><MdClose /></div>
        <div className="accept-confirmation-button" onClick={() => {
          deleteSession(session)
        }}><MdDone /></div>
      </div>
    )
  }

  const getCurrentState = (state: State) => {
    switch (state) {
      case 'default': {
        return defaultState()
      }
      case 'title-edit': {
        return titleEditState()
      }
      case 'menu': {
        return menuState()
      }
      case 'delete-confirmation': {
        return deleteConfirmationState()
      }
      default: {
        setSessionCardState('default')
        return defaultState()
      }
    }
  }



  return (
    <div key={session.id} className='session'>
      {getCurrentState(sessionCardState)}
    </div>
  )
}

export default SessionCard