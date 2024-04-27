import type { Session } from "~utils/types"
import './Sidebar.scss'

const Sidebar = (
  { sessions, selectedSession, sessionClickHandler }:
    { sessions: Session[], selectedSession: Session, sessionClickHandler: (session: Session) => void }
) => {
  return (
    <div className="sidebar">
      <div className="sessions-title">Sesssions</div>
      <div className="sessions-container">
        {sessions.map(session => (
          <div className={selectedSession?.id === session.id ? "session selected" : "session"}
            key={session.id}
            onClick={() => sessionClickHandler(session)}>

            <div className={`tabs-count color-${session.colorCode}`}>{session.tabs.length}</div>
            {session.main && <div className="main-indicator">M</div>} 
            <div className="title">{session.title}</div>

          </div>

        ))}
      </div>
    </div>
  )
}

export default Sidebar