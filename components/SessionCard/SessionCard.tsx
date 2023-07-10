import { useState } from "react";
import type { Session } from "~utils/types";
import './SessionCard.scss'
import { MdMoreVert, MdDone, MdClose, MdOutlineEdit, MdOutlineDelete, MdOutlinePushPin, MdPushPin } from 'react-icons/md'

type SessionCardArgs = {
    session: Session,
    sessionClickHandler: Function,
    mainButtonClickHandler: Function,
    deleteSession: Function,
    editSession: Function
}

const SessionCard = (
    { session, sessionClickHandler, mainButtonClickHandler, deleteSession, editSession }: SessionCardArgs
) => {

    const [sessionTitleInput, setSessionTitleInput] = useState('')
    const [sessionCardState, setSessionCardState] = useState('default')


    const defaultState = () => {
        return (
            <div className="session-container"
                onClick={() => {
                    sessionClickHandler(session.id)
                }}>
                <div className="tabs-count">{session.tabs.length <= 99 ? session.tabs.length : "+"}</div>
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
        return (
            <div className="edit-session-title-container">
                <input type="text" id="edit-title-input" className="edit-title-input" placeholder={session.title} value={sessionTitleInput}
                    onChange={e => {
                        setSessionTitleInput(e.target.value)
                    }} />
                <div className="confirm-edit-title-button" onClick={() => {
                    editSession(session.id, sessionTitleInput || session.title, () => {
                        setSessionCardState('default')
                        setSessionTitleInput('')
                    })
                }}><MdDone /></div>
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
                    <div className="delete-session-button" onClick={() => deleteSession(session.id)}><MdOutlineDelete /></div>
                    <div className="close-menu-button" onClick={() => {
                        setSessionCardState('default')
                    }}><MdClose /></div>
                </div>
            </div>
        )
    }

    const getCurrentState = (state: string) => {
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