import { useEffect, useState, type MouseEvent } from "react";
import type { Session } from "~utils/types";
import './SessionCard.scss'
import { MdMoreVert, MdDone, MdClose, MdOutlineEdit, MdOutlineDelete, MdOutlinePushPin, MdPushPin } from 'react-icons/md'
import { HiOutlineBars2 } from "react-icons/hi2";
import { TbLayersIntersect } from "react-icons/tb";
import { FaSnowflake } from "react-icons/fa"
import { INPUT_MAX_LENGTH, NUMBER_OF_COLOR_CODES } from "~utils/constants";
import store from "~store";
import actions from "~actions";
import { ItemDragController } from "~components/ReorderList/Reorder";
import { useNavigate } from "~node_modules/react-router-dom";

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
  const [showColorChanger, setShowColorChanger] = useState(false)

  const nav = useNavigate()


  const defaultState = () => {
    return (
      <div className={session.isOpen ? 'session-container open' : 'session-container'}
        onClick={(e) => {
          sessionClickHandler(session, e)
        }}>
        <div className={`tabs-count color-${session.colorCode}`}>{session.tabs.length <= 99 ? session.tabs.length : "+"}</div>
        {session.main && <div className={`main-indicator color-${session.colorCode}`}>M</div>}
        <div className="title">{session.title}</div>
        <div className="icon-button"
          onClick={e => {
            nav(`/session/${session.id}`)
            e.stopPropagation()
          }}
          title="Tabs">
          <TbLayersIntersect />
        </div>
        <div className="icon-button"
          onClick={e => {
            setSessionCardState('title-edit')
            e.stopPropagation()
          }}
          title="Edit Session Title">
          <MdOutlineEdit />
        </div>
        <div className="icon-button" onClick={e => {
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
        <div className="icon-button" onClick={_editSession}><MdDone /></div>
      </div >
    )
  }

  const menuState = () => {
    return (
      <div className="menu-session-container">
        <ItemDragController id={session.id}>
          <div className="icon-button"><HiOutlineBars2 /></div>
        </ItemDragController>
        <div className={`tabs-count color-${session.colorCode}`}
          style={{ position: "relative" }}
          onClick={() => setShowColorChanger(c => !c)}>
          {session.tabs.length} Tabs
          {showColorChanger && <div className="color-changer">
            {Array.from({ length: NUMBER_OF_COLOR_CODES }, (_, i) => i + 1).map((i: number) => {
              return <div key={i} className={`color-${i}`}
                onClick={() => {
                  store.sessions.basicUpdate(session.id, { colorCode: i })
                }}>
              </div>
            })}
          </div>}
        </div>
        <div className={session.main ? "main-session-button main" : "main-session-button"}
          onClick={() => mainButtonClickHandler(session.id)}
          title="Set Session as Main">
          {session.main ? <MdPushPin /> : <MdOutlinePushPin />}<span>Main</span>
        </div>
        <div className="buttons-container">
          <div className={"icon-button session-freeze-button " + (session.freeze ? "freeze" : "")}
            onClick={() => {
              store.sessions.setOpenStatus(session.id, { freeze: !(session.freeze || false) })
                .then(() => {
                  actions.session.refreshTabs()
                })
            }}
            title="Session Freeze">
            <FaSnowflake />
          </div>
          <div className="icon-button" onClick={() => setSessionCardState('delete-confirmation')}><MdOutlineDelete /></div>
          <div className="icon-button" onClick={() => {
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
        <div className="icon-button" onClick={() => {
          setSessionCardState('default')
        }}><MdClose /></div>
        <div className="icon-button" onClick={() => {
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
    <div className="session">
      {getCurrentState(sessionCardState)}
    </div>
  )
}

export default SessionCard