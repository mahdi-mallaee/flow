import ThemeProvider from "~components/ThemeProvider"
import './sidepanel.scss'
import '../index.scss'
import { MemoryRouter } from "react-router-dom"
import { useEffect, useState } from "react"
import SidePanelTabs from "~views/SidePanelTabs"
import useSessions from "~hooks/useSessions"
import actions from "~actions"
import SessionsContainer from "~views/SessionsContainer"
import UnsavedWindowsContainer from "~views/UnsavedWindowsContainer"
import SettignsView from "~views/SettingsView"
import { MdTune } from "~node_modules/react-icons/md"

function SidePanel() {

  const [sidePanelState, setSidePanelState] = useState('tabs')
  const sessions = useSessions()
  const [currentTabs, setCurrentTabs] = useState(sessions[0]?.tabs)
  const [sidePanelTabsTitle, setSidePanelTabsTitle] = useState('')
  const switchView = () => {
    if (sidePanelState === 'tabs') {
      return (
        <>
          <div className="session-title">{sidePanelTabsTitle}</div>
          <SidePanelTabs tabs={currentTabs}></SidePanelTabs>
        </>
      )
    } else if (sidePanelState === 'sessions') {
      return (
        <>
          <SessionsContainer />
          <UnsavedWindowsContainer />
        </>
      )
    } else if (sidePanelState === 'settings') {
      return (
        <SettignsView />
      )
    } else {
      return (
        <>
          <div className="session-title">{sidePanelTabsTitle}</div>
          <SidePanelTabs tabs={currentTabs}></SidePanelTabs>
        </>
      )
    }
  }

  useEffect(() => {
    chrome.windows.getCurrent().then(window => {
      if (actions.window.checkId(window.id)) {
        const session = sessions.find(session => session.windowId === window.id)
        if (session) {
          setCurrentTabs(session.tabs)
          setSidePanelTabsTitle(session.title)
        } else {
          actions.window.getTabs(window.id)
            .then(tabs => {
              setCurrentTabs(tabs)
              setSidePanelTabsTitle(`Unsaved Window (${window.id})`)
            })
        }
      }
    })
  }, [sessions])


  return (
    <ThemeProvider>
      <MemoryRouter>
        <div className="side-panel">

          <div className="side-panel-buttons-container">
            <div className="side-panel-buttons">
              <div className={sidePanelState === 'tabs' ? "button tabs active" : "button tabs"}
                onClick={() => setSidePanelState('tabs')}>
                tabs
              </div>
              <div className={sidePanelState === 'sessions' ? "button sessions active" : "button sessions"}
                onClick={() => setSidePanelState('sessions')}>
                sessions
              </div>
              <div className={sidePanelState === 'settings' ? "button settings active" : "button settings"}
                onClick={() => setSidePanelState("settings")}>
                <MdTune />
              </div>
            </div>
          </div>

          <div className="sessions-router">
            {switchView()}
          </div>
        </div>
      </MemoryRouter>
    </ThemeProvider>
  )
}

export default SidePanel