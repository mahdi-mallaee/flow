import useSessions from "~hooks/useSessions"
import './sessions.scss'
import ThemeProvider from "~components/ThemeProvider"
import TabCard from "~components/TabCard"
import { useState, } from "react"
import Logo from "~components/Logo"
import { MdTune } from "react-icons/md"
import TabSearchResults from "~components/TabSearchResults"
import Toolbar from "~components/Toolbar"

const SessionsTabPage = () => {
  const sessions = useSessions()
  const [selectedSessionId, setSelectedSessionId] = useState<string>(null)
  const selectedSession = sessions.find(session => session.id === selectedSessionId) || sessions[0]
  const [searchInput, setSearchInput] = useState("")

  return (
    <ThemeProvider>
      <div className="sessions-page">
        <div className="sidebar">
          <div className="sessions-container">
            {sessions.map(session => (
              <div className="session" key={session.id} onClick={() => setSelectedSessionId(session.id)}>
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
          <Toolbar
            title={searchInput ? "Search Results" :
              selectedSession ? selectedSession.title : 'Select a session'}
            setSearchInput={setSearchInput} />
          {
            searchInput ?
              <TabSearchResults sessions={sessions} searchInput={searchInput} />
              :
              <div className="tabs-container">
                {selectedSession &&
                  selectedSession.tabs.map((tab, i) => (
                    <TabCard key={tab.id || i} tab={tab} session={selectedSession} />
                  ))
                }
              </div>
          }
        </div>

      </div>
    </ThemeProvider>
  )
}

export default SessionsTabPage