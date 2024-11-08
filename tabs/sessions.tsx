import useSessions from "~hooks/useSessions"
import './sessions.scss'
import ThemeProvider from "~components/ThemeProvider"
import TabCard from "~components/TabCard"
import { useEffect, useState, } from "react"
import Logo from "~components/Logo"
import { MdTune } from "react-icons/md"
import TabSearchResults from "~components/tabSearchResults"
import Toolbar from "~components/Toolbar"
import type { Session, Tab } from "~utils/types"
import actions from "~actions"
import Sidebar from "~components/Sidebar"
import store from "~store"

const SessionsTabPage = () => {
  const sessions = useSessions()
  const [selectedSession, setSelectedSession] = useState(sessions[0])
  const [searchInput, setSearchInput] = useState("")

  const tabCardClickHandler = async (tab: Tab) => {
    if (selectedSession.isOpen) {
      chrome.windows.update(tab.windowId, { focused: true, })
      chrome.tabs.update(tab.id, { active: true, })
    } else {
      const windowId = await actions.message.openSession({ sessionId: selectedSession.id, exludedTabIndex: tab.index })
      chrome.windows.update(windowId, { focused: true, })
      const tabs = await actions.window.getTabs(windowId)
      await chrome.tabs.update(tabs[tab.index].id, { active: true, })
    }
  }

  const sessionClickHandler = (session: Session) => {
    setSelectedSession(session)
  }

  useEffect(() => {
    if (!selectedSession) {
      chrome.windows.getCurrent().then(window => {
        if (actions.window.checkId(window.id)) {
          const session = sessions.find(session => session.windowId === window.id) || sessions[0]
          setSelectedSession(session)
        }
      })
    }
  }, [sessions])

  const mainSesssionHandler = () => {
    store.sessions.basicUpdate(selectedSession.id, { main: !selectedSession.main })
  }

  return (
    <ThemeProvider>
      <div className="sessions-page">
        <Sidebar selectedSession={selectedSession} sessions={sessions} sessionClickHandler={sessionClickHandler}></Sidebar>
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
            setSearchInput={setSearchInput} mainSessionHandler={mainSesssionHandler} />
          {
            searchInput ?
              <TabSearchResults sessions={sessions} searchInput={searchInput} />
              :
              <div className="tabs-container">
                {selectedSession &&
                  selectedSession.tabs.map((tab, i) => (
                    <TabCard key={tab.id || i} tab={tab} onClickHandler={() => tabCardClickHandler(tab)} />
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