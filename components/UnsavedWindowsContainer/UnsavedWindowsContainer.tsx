import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { MdAdd } from "react-icons/md"
import createNewSession from "~actions/createNewSession"
import refreshUnsavedWindows from "~actions/refreshUnsavedWindows"
import { StoreKeys, type UnsavedWindow } from "~utils/types"
import './UnsavedWindowsContainer.scss'
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import refreshOpenSessions from "~actions/refreshOpenSessions"

const UnsavedWindowsContainer = () => {
  const [unsavedWindows] = useStorage<UnsavedWindow[]>({
    key: StoreKeys.unsavedWindows,
    instance: new Storage({
      area: "local"
    })
  }, [])

  const [currentWindowId, setCurrentWindowId] = useState(-1)

  const [initialAnimation, setInitialAnimation] = useState(false)

  const addAsSessionButtonClickHandler = async (window: UnsavedWindow) => {
    await createNewSession(window.id)
    refreshUnsavedWindows()
    refreshOpenSessions()
  }

  const setCurrentWindow = async () => {
    const currentWindow = await chrome.windows.getCurrent()
    if (currentWindow.id && currentWindow.id > 0) {
      setCurrentWindowId(currentWindow.id)
    }
  }

  useEffect(() => {
    setCurrentWindow()
    setTimeout(() => {
      setInitialAnimation(true)
    }, 200)
  }, [])

  return (
    <AnimatePresence>
      {unsavedWindows.length >= 1 &&
        <motion.div
          className="unsaved-windows-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          <div className="view-title unsaved-windows-title">Unsaved Windows</div>

          <div className="unsaved-windows">
            {unsavedWindows.map(window => {
              return (
                <motion.div
                  key={window.id}
                  initial={{ opacity: initialAnimation ? 0 : 1, height: initialAnimation ? 0 : 'auto' }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}>
                  <div key={window.id} className={'unsaved-window' + ' ' + (window.id === currentWindowId && 'current')}>
                    <div className="title">
                      <span className="tabs-count">{window.tabsCount}</span>
                      Unsaved Window ( {window.id} )
                    </div>
                    <div className='add-as-session-button' onClick={() => { addAsSessionButtonClickHandler(window) }}>
                      Add<MdAdd />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      }
    </AnimatePresence>
  )
}

export default UnsavedWindowsContainer