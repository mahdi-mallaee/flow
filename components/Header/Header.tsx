import { MdArrowBack, MdTune } from "react-icons/md"
import { BsLayoutSidebarInsetReverse } from "react-icons/bs"
import Logo from "~components/Logo"
import { useNavigate, useLocation } from 'react-router-dom'
import type { Path } from "~utils/types"
import './Header.scss'

const Header = ({ headerButtonPath }: { headerButtonPath: Path }) => {
  const nav = useNavigate()
  const location = useLocation()

  async function toggleSidePanel() {
    const windowId = (await chrome.windows.getCurrent())?.id
    if (!windowId) return
    const options = await chrome.sidePanel.getOptions({})
    await chrome.sidePanel.setOptions({ enabled: !options.enabled, })
    if (!options.enabled) await chrome.sidePanel.open({ windowId })
  }

  return (
    <div className="header">
      <div className="logo"><Logo /></div>
      <div className='title'>Flow</div>

      <div className="header-buttons" >
        {location.pathname == "/" &&
          <div className="side-panel-button" onClick={toggleSidePanel}>
            <BsLayoutSidebarInsetReverse />
          </div>
        }
        <div className="settings-button" onClick={() => nav(headerButtonPath)}>
          {location.pathname !== '/' ? <MdArrowBack /> : <MdTune />}
        </div>
      </div>
    </div>

  )
}

export default Header