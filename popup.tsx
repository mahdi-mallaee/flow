import './index.scss'
import { useStorage } from "@plasmohq/storage/hook"
import ThemeProvider from "~components/ThemeProvider"
import { useEffect, useRef, useState } from 'react'
import ViewRouter from '~views/ViewRouter'
import { MemoryRouter } from 'react-router-dom'
import { DEFAULT_MAIN_CONTAINER_HEIGHT } from '~utils/constants'
import { localStore } from '~utils/storageManager'
import { StoreKeys } from '~utils/types'
import actions from '~actions'
import browser from "webextension-polyfill";
(globalThis as any).chrome = browser;

const IndexPopup = () => {
  const [containerHeight, setContainerHeight] = useState(DEFAULT_MAIN_CONTAINER_HEIGHT)

  const [mainViewHeight, setMainViewHeight] = useStorage<number>({
    key: StoreKeys.mainHeight,
    instance: localStore
  }, DEFAULT_MAIN_CONTAINER_HEIGHT)

  const ref = useRef(null)
  useEffect(() => {

    const observer = new ResizeObserver(entries => {
      const height = entries[0].target.clientHeight
      if (height != DEFAULT_MAIN_CONTAINER_HEIGHT) {
        setContainerHeight(height)
      }
    })
    if (ref.current) {
      observer.observe(ref.current)
    }

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

  return (
    <ThemeProvider>
      <MemoryRouter>
        <div className="main-view">
          <div className='height-container' ref={ref} style={{ height: mainViewHeight }}>
            <ViewRouter />
          </div>
        </div>
      </MemoryRouter>
    </ThemeProvider>
  )
}

export default IndexPopup
