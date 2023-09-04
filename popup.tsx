import './index.scss'
import './utils/colors.scss'
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import ThemeProvider from "~components/ThemeProvider"
import { useEffect, useRef, useState } from 'react'
import MainContent from '~components/MainContent/MainContent'
import refreshLastClosedWindow from '~actions/refreshLastClosedWindow'
import refreshOpenSessions from '~actions/refreshOpenSessions'
import refreshUnsavedWindows from '~actions/refreshUnsavedWindows'
import { MemoryRouter } from 'react-router-dom'

const IndexPopup = () => {

  const defaultContainerHeight = 400
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

    refreshLastClosedWindow()
    refreshOpenSessions()
    refreshUnsavedWindows()
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (containerHeight !== defaultContainerHeight) {
      setMainViewHeight(containerHeight)
    }
  }, [containerHeight])

  return (
    <ThemeProvider>
      <MemoryRouter>
        <div className="main-view">
          <div className='height-container' ref={ref} style={{ height: mainViewHeight }}>
            <MainContent />
          </div>
        </div >
      </MemoryRouter>
    </ThemeProvider>
  )
}

export default IndexPopup
