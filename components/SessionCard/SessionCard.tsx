import { useState } from "react";
import type { Session } from "~utils/types";
import './SessionCard.scss'

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
                <div className="tabs-count">{session.tabs.length}</div>
                {session.main && <div className="main-indicator">M</div>}
                <div className="title">{session.title}</div>
                <button className="main-button" onClick={e => {
                    setSessionCardState('title-edit')
                    e.stopPropagation()
                }}>edit</button>
                <button className="menu-session-button" onClick={e => {
                    setSessionCardState('menu')
                    e.stopPropagation()
                }}>menu</button>
            </div>
        )
    }

    const titleEditState = () => {
        return (
            <div className="edit-session-title-container">
                <input type="text" placeholder={session.title} value={sessionTitleInput}
                    onChange={e => {
                        setSessionTitleInput(e.target.value)
                    }} />
                <button onClick={() => {
                    editSession(session.id, sessionTitleInput || session.title, () => {
                        setSessionCardState('default')
                        setSessionTitleInput('')
                    })
                }}>edit</button>
            </div>
        )
    }

    const menuState = () => {
        return (
            <div className="menu-session-container">
                <div className="tabs-count">{session.tabs.length} Tabs</div>
                <button className="main-session-button" onClick={() => mainButtonClickHandler(session.id)}>main</button>
                <button className="delete-session" onClick={() => deleteSession(session.id)}>del</button>
                <div className="close-menu-button" onClick={() => {
                    setSessionCardState('default')
                }}>x</div>
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