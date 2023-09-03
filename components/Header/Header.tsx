import { MdArrowBack, MdTune } from "react-icons/md"
import Logo from "~components/Logo"
import { useNavigate, useLocation } from 'react-router-dom'
import type { Path } from "~utils/types"

const Header = ({ settingsButtonPath }: { settingsButtonPath: Path }) => {
  const nav = useNavigate()
  const location = useLocation()

  return (
    <div className="header">
      <div className="logo"><Logo /></div>
      <div className='title'>Future Tabs</div>
      <div className="settings-button" onClick={() => nav(settingsButtonPath)}>
        {location.pathname !== '/' ? <MdArrowBack /> : <MdTune />}
      </div>
    </div>
  )
}

export default Header