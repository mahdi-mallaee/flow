import ThemeProvider from "~components/ThemeProvider"
import './sidepanel.scss'
import '../index.scss'
import { MemoryRouter, useNavigate } from "react-router-dom"
import { MdTune } from "~node_modules/react-icons/md"
import ViewRouter from "~views/ViewRouter"
import { useLocation } from "react-router-dom"

function SidePanel() {
  const { pathname: path } = useLocation()
  const nav = useNavigate()

  return (
    <div className="side-panel">

      <div className="side-panel-buttons-container">
        <div className="side-panel-buttons">
          <div className={path === '/' ? "button tabs active" : "button tabs"}
            onClick={() => nav("/")}>
            tabs
          </div>
          <div className={path === '/main' ? "button sessions active" : "button sessions"}
            onClick={() => nav('/main')}>
            sessions
          </div>
          <div className={path === '/settings' ? "button settings active" : "button settings"}
            onClick={() => nav('/settings')}>
            <MdTune />
          </div>
        </div>
      </div>

      <div className="sessions-router">
        <ViewRouter isPopup={false} />
      </div>
    </div>
  )
}

function SidePanelWrapper() {

  return (
    <ThemeProvider>
      <MemoryRouter>
        <SidePanel />
      </MemoryRouter>
    </ThemeProvider>
  )
}

export default SidePanelWrapper