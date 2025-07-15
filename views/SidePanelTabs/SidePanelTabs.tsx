import React, { useEffect, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import type { Session, Tab } from '~utils/types';
import './SidePanelTabs.scss';
import { MdAdd, MdClose, MdOutlinePushPin } from 'react-icons/md';
import { NEW_TAB_URL } from '~utils/constants';
import { AnimatePresence, motion } from 'framer-motion';
import ContextMenu from '~components/ContextMenu/ContexMenu';
import useSessions from '~hooks/useSessions';
import actions from '~actions';

const SidePanelTabs = () => {
  const sessions = useSessions()
  const [tabs, setTabs] = useState(sessions[0]?.tabs)
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
    setSelectedTabs(tabs.map(tab => tab.id))
  }

  const closeAllClickHandler = () => {
    if (selectedTabs.length === tabs.length) {
      console.log('this will remove the session')
    } else {
      chrome.tabs.remove(selectedTabs)
      setSelectedTabs([])
    }
  }

  const [showContext, setShowContext] = useState(false)
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 })
  const [contextTab, setContextTab] = useState<Tab>()

  const contextRef = useRef<HTMLDivElement>()

  const tabOnContextMenuHandler = (e: React.MouseEvent, tab: Tab) => {
    e.stopPropagation()
    e.preventDefault()
    setShowContext(c => !c)
    setContextPos({ x: e.clientX, y: e.clientY })
    setContextTab(tab)
  }

  useEffect(() => {
    if (contextRef.current) {
      const width = contextRef.current.scrollWidth
      const height = contextRef.current.scrollHeight
      const x = window.innerWidth - width < contextPos.x ? window.innerWidth - width : contextPos.x
      const y = window.innerHeight - height < contextPos.y ? window.innerHeight - height : contextPos.y
      setContextPos({ x, y })
    }

  }, [showContext, contextPos.x, contextPos.y])

  useEffect(() => {
    document.addEventListener('click', () => {
      setShowContext(false)
    })
    document.addEventListener('contextmenu', () => {
      // e.preventDefault()
      setShowContext(false)
    })
    window.addEventListener('blur', () => {
      setShowContext(false)

    })
  }, [])


  useEffect(() => {
    chrome.windows.getCurrent().then(window => {
      if (actions.window.checkId(window.id)) {
        const session = sessions.find(session => session.windowId === window.id)
        if (session) {
          setTabs(session.tabs)
        } else {
          actions.window.getTabs(window.id)
            .then(tabs => {
              setTabs(tabs)
            })
        }
      }
    })
  }, [sessions])

  const [draggedId, setDraggedId] = useState<number>()

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    chrome.tabs.move(draggedId, { index })
  }

  return (
    <div className='side-panel-tabs'>
      <AnimatePresence>

        {showContext &&
          <ContextMenu x={contextPos.x} y={contextPos.y} tab={contextTab} contextRef={contextRef}></ContextMenu>
        }
      </AnimatePresence>

      <div className="tabs-container">
        <AnimatePresence>
          {tabs?.map(tab => {
            return (
              <motion.div className={selectedTabs?.indexOf(tab.id) >= 0 ? 'selected tab' : 'tab'}
                onClick={(e) => tabClickHandler(e, tab.id)}
                transition={{ duration: 0.1 }}
                key={tab.id}
                onContextMenu={(e) => { tabOnContextMenuHandler(e, tab) }}
                draggable={true}
                onDragEnd={() => { setDraggedId(0) }}
                onDragStart={() => { setDraggedId(tab.id) }}
                onDragEnter={(e) => { handleDragEnter(e, tab.index) }}>

                {tab.pinned && <div className="pinned-icon"><MdOutlinePushPin /></div>}
                <div className='icon'><img src={tab.iconUrl} /></div>
                <div className='title'>{tab.title}</div>
                <div className="close-button" onClick={(e) => {
                  e.stopPropagation()
                  closeTabClickHandler(tab.id)
                }}><MdClose /></div>
              </motion.div>
            )
          })}
        </AnimatePresence>
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
              <div className="move-selection">move selection</div>
            </motion.div>}
        </AnimatePresence>
      </div>
      <div className="new-tab" onClick={newTabClickHandler}><MdAdd /> Create a new tab</div>
    </div>
  )
}

export default SidePanelTabs;