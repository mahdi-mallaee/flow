import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { MdAdd } from "react-icons/md"
import createNewSession from "~actions/createNewSession"
import refreshUnsavedWindows from "~actions/refreshUnsavedWindows"
import type { Session } from "~utils/types"
import './UnsavedWindowsContainer.scss'
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

const UnsavedWindowsContainer = ({ sessions, setSessions }: { sessions: Session[], setSessions: Function }) => {
  const [unsavedWindows] = useStorage<chrome.windows.Window[]>({
    key: "unsaved-windows",
    instance: new Storage({
      area: "local"
    })
  }, [])

  const [initialAnimation, setInitialAnimation] = useState(false)

  const addAsSessionButtonClickHandler = async (window: chrome.windows.Window) => {
    const newSession = await createNewSession(window.id)
    await setSessions(current => { return [newSession, ...current] })
    refreshUnsavedWindows([newSession, ...sessions])
  }

  useEffect(() => {
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
                  <div key={window.id} className='unsaved-window'>
                    <div className="title">Unsaved Window ( {window.id} )</div>
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