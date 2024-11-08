import { MdArrowBack, MdTune } from "react-icons/md"
import Logo from "~components/Logo"
import { useNavigate, useLocation } from 'react-router-dom'
import type { Path } from "~utils/types"
import './Header.scss'

const Header = ({ headerButtonPath }: { headerButtonPath: Path }) => {
  const nav = useNavigate()
  const location = useLocation()

  return (
    <div className="header">
      <div className="logo"><Logo /></div>
      <div className='title'>Flow</div>
      <div className="header-button" onClick={() => nav(headerButtonPath)}>
        {location.pathname !== '/' ? <MdArrowBack /> : <MdTune />}
      </div>
    </div>
  )
}

export default Header