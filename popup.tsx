import './index.scss'
import './utils/colors.scss'
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import type { Session } from "~utils/types"
import { MdTune } from 'react-icons/md'
import Logo from "~components/Logo"
import ThemeProvider from "~components/ThemeProvider"
import SessionsContainer from "~components/SessionsContainer"
import UnsavedWindowsContainer from '~components/UnsavedWindowsContainer'

const IndexPopup = () => {
  const [sessions, setSessions] = useStorage<Session[]>({
    key: "sessions",
    instance: new Storage({
      area: "local"
    })
  }, [])

  return (
    <ThemeProvider>
      <div className="main-view">
        
        <div className="header">
          <div className="logo"><Logo /></div>
          <div className='title'>Future Tabs</div>
          <div className="settings-button"><MdTune /></div>
        </div>

        <SessionsContainer sessions={sessions} setSessions={setSessions} />
        <UnsavedWindowsContainer sessions={sessions} setSessions={setSessions} />

      </div >
    </ThemeProvider>
  )
}

export default IndexPopup
