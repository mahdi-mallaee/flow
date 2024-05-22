import './index.scss'
import { useStorage } from "@plasmohq/storage/hook"
import { Storage } from "@plasmohq/storage"
import ThemeProvider from "~components/ThemeProvider"
import { useEffect, useRef, useState } from 'react'
import ViewRouter from '~views/ViewRouter'
import { MemoryRouter } from 'react-router-dom'
import { DEFAULT_MAIN_CONTAINER_HEIGHT } from '~utils/constants'
import actions from '~actions'

const IndexPopup = () => {
  const [containerHeight, setContainerHeight] = useState(DEFAULT_MAIN_CONTAINER_HEIGHT)

  const [mainViewHeight, setMainViewHeight] = useStorage<number>({
    key: "mainheight",
    instance: new Storage({
      area: "local"
    })
  }, DEFAULT_MAIN_CONTAINER_HEIGHT)

  const ref = useRef(null)
  useEffect(() => {

    const observer = new ResizeObserver(entries => {
      const height = entries[0].target.clientHeight
      if (height != DEFAULT_MAIN_CONTAINER_HEIGHT) {
        setContainerHeight(height)
      }
    })
    observer.observe(ref.current)

    actions.window.refreshLastClosedWindow()
    actions.session.refreshOpenSessions()
    actions.window.refreshUnsavedWindows()
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (containerHeight !== DEFAULT_MAIN_CONTAINER_HEIGHT) {
      setMainViewHeight(containerHeight)
    }
  }, [containerHeight])

  const openSidePanel = async () => {
    const windowId = (await chrome.windows.getCurrent()).id
    const options = await chrome.sidePanel.getOptions({})
    await chrome.sidePanel.setOptions({ enabled: !options.enabled, })
    await chrome.sidePanel.open({ windowId })
  }

  return (
    <ThemeProvider>
      <MemoryRouter>
        <div className="main-view">
          <button onClick={openSidePanel}>side panel</button>
          <div className='height-container' ref={ref} style={{ height: mainViewHeight }}>
            <ViewRouter />
          </div>
        </div >
      </MemoryRouter>
    </ThemeProvider >
  )
}

export default IndexPopup
