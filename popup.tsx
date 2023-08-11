import './index.scss'
import './utils/colors.scss'
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import type { Session } from "~utils/types"
import { MdArrowBack, MdTune } from 'react-icons/md'
import Logo from "~components/Logo"
import ThemeProvider from "~components/ThemeProvider"
import SessionsContainer from "~components/SessionsContainer"
import UnsavedWindowsContainer from '~components/UnsavedWindowsContainer'
import { useEffect, useRef, useState } from 'react'
import SettignsView from '~components/SettingsView'
import refreshOpenSessions from '~actions/refreshOpenSessions'
import refreshUnsavedWindows from '~actions/refreshUnsavedWindows'
import refreshTabs from '~actions/refreshTabs'
import refreshLastClosedWindow from '~actions/refreshLastClosedWindow'

const IndexPopup = () => {
  const [sessions, setSessions] = useStorage<Session[]>({
    key: "sessions",
    instance: new Storage({
      area: "local"
    })
  }, [])

  const [showSettingsView, setShowSettingsView] = useState(false)

  const defaultContainerHeight = 350
  const [containerHeight, setContainerHeight] = useState(defaultContainerHeight)

  const [mainViewHeight, setMainViewHeight] = useStorage<number>({
    key: "mainheight",
    instance: new Storage({
      area: "local"
    })
  }, defaultContainerHeight)

  const ref = useRef(null)
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const height = entries[0].target.clientHeight
      if (height != defaultContainerHeight) {
        setContainerHeight(height)
      }
    })
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (containerHeight !== defaultContainerHeight) {
      setMainViewHeight(containerHeight)
    }
  }, [containerHeight])

  useEffect(() => {
    refreshOpenSessions()
    refreshUnsavedWindows()
    refreshTabs()
    refreshLastClosedWindow()
  }, [])

  return (
    <ThemeProvider>
      <div className="main-view">

        <div className="header">
          <div className="logo"><Logo /></div>
          <div className='title'>Future Tabs</div>
          <div className="settings-button" onClick={() => {
            setShowSettingsView(current => !current)
          }}>
            {showSettingsView ? <MdArrowBack /> : <MdTune />}
          </div>
        </div>

        <div className='height-container' ref={ref} style={{ height: mainViewHeight }}>
          {showSettingsView ?
            <SettignsView />
            :
            <>
              <SessionsContainer sessions={sessions} setSessions={setSessions} />
              <UnsavedWindowsContainer sessions={sessions} setSessions={setSessions} />
            </>
          }
        </div>

      </div >
    </ThemeProvider>
  )
}

export default IndexPopup
