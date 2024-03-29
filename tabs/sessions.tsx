import useSessions from "~hooks/useSessions"
import './sessions.scss'
import ThemeProvider from "~components/ThemeProvider"
import TabCard from "~components/TabCard"
import { useEffect, useState } from "react"
import type { Session } from "~utils/types"
import Logo from "~components/Logo"
import { MdEdit, MdOutlineDelete, MdOutlineEdit, MdOutlinePushPin, MdPushPin, MdSearch, MdTune } from "react-icons/md"

const tabSession = () => {
  const sessions = useSessions()
  const [selectedSession, setSelectedSession] = useState<Session>(null)

  useEffect(() => {
    if (!selectedSession) {
      setSelectedSession(sessions[0])
    }
  }, [sessions])

  return (
    <ThemeProvider>
      <div className="sessions-page">
        <div className="sidebar">
          <div className="sessions-container">
            {sessions.map(session => (
              <div className="session" key={session.id} onClick={() => setSelectedSession(session)}>
                <div className={`tabs-count color-${session.colorCode}`}>{session.tabs.length}</div>
                {session.main && <div className="main-indicator">M</div>}
                <div className="title">{session.title}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="main">
          <div className="header">
            <div className="logo">
              <Logo />
              <div className="title">Flow</div>
            </div>
            <div className="settings">
              <MdTune />
            </div>
          </div>
          <div className="toolbar">
            <div className="searchbar">
              <MdSearch />
              <input type="text" placeholder="Search in items ..." />
            </div>
            <div className="session-menu">
              <div className="title">{selectedSession && selectedSession.title}</div>
              <div className="buttons">
                <MdOutlineEdit />
                <MdOutlineDelete/>
                <MdOutlinePushPin />
              </div>
            </div>
          </div>
          <div className="tabs-container">
            {selectedSession &&
              selectedSession.tabs.map((tab, i) => (
                <TabCard key={tab.id || i} tab={tab} />
              ))
            }
          </div>
        </div>

      </div>
    </ThemeProvider>
  )
}

export default tabSession