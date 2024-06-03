import { motion } from 'framer-motion'
import { NEW_TAB_URL } from '~utils/constants'
import type { Tab } from '~utils/types'
const ContextMenu = ({ x, y, tab, contextRef }: { x: number, y: number, tab: Tab, contextRef: any }) => {

  const pinContextClickHandler = () => {
    chrome.tabs.update(tab.id, { pinned: !tab.pinned })
  }

  const closeContextClickHandler = () => {
    chrome.tabs.remove(tab.id)
  }

  const duplicateContextClickHandler = () => {
    chrome.tabs.duplicate(tab.id)
  }

  const newTabContextClickHandler = () => {
    chrome.tabs.create({ url: NEW_TAB_URL, index: tab.index + 1 })
  }

  return (
    <motion.div ref={contextRef} className="context-menu"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.17 }}
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}>
      <div onClick={pinContextClickHandler}>{tab.pinned ? "Unpin" : "Pin"}</div>
      <div onClick={newTabContextClickHandler}>Create new tab</div>
      <div>Add to a new group</div>
      <div onClick={duplicateContextClickHandler}>Duplicate</div>
      <div onClick={closeContextClickHandler}>Close tab</div>
    </motion.div>
  )
}

export default ContextMenu