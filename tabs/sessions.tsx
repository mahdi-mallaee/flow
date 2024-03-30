import useSessions from "~hooks/useSessions"
import './sessions.scss'
import ThemeProvider from "~components/ThemeProvider"
import TabCard from "~components/TabCard"
import { useEffect, useState, } from "react"
import type { Session } from "~utils/types"
import Logo from "~components/Logo"
import { MdOutlineDelete, MdOutlineEdit, MdOutlinePushPin, MdSearch, MdTune } from "react-icons/md"
import TabSearchResults from "~components/tabSearchResults"

const tabSession = () => {
  const sessions = useSessions()
  const [selectedSession, setSelectedSession] = useState<Session>(null)
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    if (!selectedSession) {
      setSelectedSession(sessions[0])
    } else {
      setSelectedSession(sessions.find(session => session.id === selectedSession.id))
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
              <input type="text" placeholder="Search in items ..." onChange={e => setSearchInput(e.target.value)} />
            </div>
            <div className="session-menu">
              <div className="title">
                {searchInput ?
                  "Search Results" :
                  selectedSession ? selectedSession.title : 'Select a session'
                }
              </div>
              <div className="buttons">
                <MdOutlineEdit />
                <MdOutlineDelete />
                <MdOutlinePushPin />
              </div>
            </div>
          </div>
          {
            searchInput ?
              <TabSearchResults sessions={sessions} searchInput={searchInput} />
              :
              <div className="tabs-container">
                {selectedSession &&
                  selectedSession.tabs.map((tab, i) => (
                    <TabCard key={i} tab={tab} session={selectedSession} />
                  ))
                }
              </div>
          }
        </div>

      </div>
    </ThemeProvider>
  )
}

export default tabSession