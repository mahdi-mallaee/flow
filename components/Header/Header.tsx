import { MdArrowBack, MdOpenInNew, MdTune } from "react-icons/md"
import Logo from "~components/Logo"
import { useNavigate, useLocation } from "react-router-dom"
import type { Path } from "~utils/types"
import actions from "~actions"
import "./Header.scss"

const Header = ({ headerButtonPath }: { headerButtonPath: Path }) => {
  const nav = useNavigate()
  const location = useLocation()

  return (
    <div className="header">
      <div className="logo"><Logo /></div>
      <div className="title">Flow</div>
      <div className="header-buttons">
        {location.pathname === "/" && (
          <div
            className="header-button"
            title="Open Session Manager"
            onClick={() => actions.session.openSessionsPage()}
          >
            <MdOpenInNew />
          </div>
        )}
        <div
          className="header-button"
          title={location.pathname !== "/" ? "Back" : "Settings"}
          onClick={() => nav(headerButtonPath)}
        >
          {location.pathname !== "/" ? <MdArrowBack /> : <MdTune />}
        </div>
      </div>
    </div>
  )
}

export default Header