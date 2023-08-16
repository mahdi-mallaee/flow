import './index.scss'
import './utils/colors.scss'
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import type { MainContentState } from "~utils/types"
import { MdArrowBack, MdTune } from 'react-icons/md'
import Logo from "~components/Logo"
import ThemeProvider from "~components/ThemeProvider"
import { useEffect, useRef, useState } from 'react'
import refreshOpenSessions from '~actions/refreshOpenSessions'
import refreshUnsavedWindows from '~actions/refreshUnsavedWindows'
import refreshTabs from '~actions/refreshTabs'
import refreshLastClosedWindow from '~actions/refreshLastClosedWindow'
import MainContent from '~components/MainContent/MainContent'

const IndexPopup = () => {

  const [mainContentState, setMainContentState] = useState<MainContentState>('sessions')

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

  const settingsButtonClickHandler = () => {
    switch (mainContentState) {
      case 'sessions': {
        setMainContentState('settings')
        break
      }
      case 'settings': {
        setMainContentState('sessions')
        break
      }
      case 'backups': {
        setMainContentState('settings')
        break
      }
      default: {
        setMainContentState('sessions')
        break
      }
    }
  }

  return (
    <ThemeProvider>
      <div className="main-view">

        <div className="header">
          <div className="logo"><Logo /></div>
          <div className='title'>Future Tabs</div>
          <div className="settings-button" onClick={settingsButtonClickHandler}>
            {mainContentState !== 'sessions' ? <MdArrowBack /> : <MdTune />}
          </div>
        </div>

        <div className='height-container' ref={ref} style={{ height: mainViewHeight }}>
          <MainContent mainContentState={mainContentState} setMainContentState={setMainContentState} />
        </div>

      </div >
    </ThemeProvider>
  )
}

export default IndexPopup
