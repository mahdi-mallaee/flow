import React from 'react';
import type { Session } from '~utils/types';
import './SidePanelTabs.scss';
import { MdAdd, MdClose } from 'react-icons/md';
import { NEW_TAB_URL } from '~utils/constants';
import { AnimatePresence, motion } from 'framer-motion';

const SidePanelTabs = ({ session }: { session: Session }) => {

  const [selectedTabs, setSelectedTabs] = React.useState<number[]>([])

  const tabClickHandler = (e: React.MouseEvent, id: number) => {
    if (e.shiftKey) {
      const index = selectedTabs.indexOf(id)
      if (index > -1) {
        setSelectedTabs(selectedTabs.filter(tabId => tabId !== id))
      } else {
        setSelectedTabs([...selectedTabs, id])
      }
    } else {
      chrome.tabs.update(id, { active: true, })
    }
  }

  const closeTabClickHandler = (id: number) => {
    chrome.tabs.remove(id)
  }

  const newTabClickHandler = () => {
    chrome.tabs.create({ url: NEW_TAB_URL, })
  }

  const clearSelectedClickHandler = () => {
    setSelectedTabs([])
  }

  const selectAllClickHandler = () => {
    setSelectedTabs(session.tabs.map(tab => tab.id))
  }

  const closeAllClickHandler = () => {
    if (selectedTabs.length === session.tabs.length) {
      console.log('this will remove the session')
    } else {
      chrome.tabs.remove(selectedTabs)
      setSelectedTabs([])
    }
  }

  return (
    <div className='side-panel-tabs'>

      <div className="tabs-container">
        {session?.tabs.map(tab => {
          return (
            <div className={selectedTabs?.indexOf(tab.id) >= 0 ? 'selected tab' : 'tab'} onClick={(e) => tabClickHandler(e, tab.id)} key={tab.id}>
              <div className='icon'><img src={tab.iconUrl} /></div>
              <div className='title'>{tab.title}</div>
              <div className="close-button" onClick={(e) => {
                e.stopPropagation()
                closeTabClickHandler(tab.id)
              }}><MdClose /></div>
            </div>
          )
        })}
      </div>
      <div>
        <AnimatePresence>
          {selectedTabs.length > 0 &&
            <motion.div className="tabs-toolbar"
              initial={{ opacity: 0.1, height: 0 }}
              animate={{ opacity: 1, height: '40px' }}
              exit={{ opacity: 0.2, height: 0 }}
              transition={{ duration: 0.2 }}>
              <span className="tabs-count">{selectedTabs?.length}</span>
              <div className="clear-selected" onClick={clearSelectedClickHandler}>clear selection</div>
              <div className="select-all" onClick={selectAllClickHandler}>select all</div>
              <div className="close-all" onClick={closeAllClickHandler}>close</div>
            </motion.div>}
        </AnimatePresence>
      </div>
      <div className="new-tab" onClick={newTabClickHandler}><MdAdd /> Create a new tab</div>
    </div>
  )
}

export default SidePanelTabs;