import React, { useEffect, useRef, useState } from 'react';
import type { Session, Tab } from '~utils/types';
import './SidePanelTabs.scss';
import { MdAdd, MdClose, MdOutlinePushPin } from 'react-icons/md';
import { NEW_TAB_URL } from '~utils/constants';
import { AnimatePresence, motion } from 'framer-motion';
import ContextMenu from '~components/ContextMenu/ContexMenu';
import useSessions from '~hooks/useSessions';
import actions from '~actions';

const SidePanelTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [selectedTabs, setSelectedTabs] = React.useState<number[]>([])
  const [viewTitle, setViewTitle] = useState<string>('Sessions')
  const scrollRef = useRef<HTMLDivElement>(null)

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
      setSelectedTabs([id])
    }
  }

  const closeTabClickHandler = (id: number) => {
    if (selectedTabs.length > 0) {
      chrome.tabs.remove(selectedTabs)
      setSelectedTabs([])
    } else {
      chrome.tabs.remove(id)
    }
  }

  const newTabClickHandler = async () => {
    console.log(scrollRef.current.scrollHeight)
    await chrome.tabs.create({ url: NEW_TAB_URL, })
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 200)
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
    window.addEventListener("keydown", (e) => {
      if (e.key === 'Escape') {
        setShowContext(false)

      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedTabs.length > 0) {
          chrome.tabs.remove(selectedTabs)
          setSelectedTabs([])
        }
      } else if (e.key === 'a' && e.ctrlKey) {
        e.preventDefault()
        setSelectedTabs(tabs.map(tab => tab.id))
      }
    })
    return () => {
      document.removeEventListener('click', () => { })
      document.removeEventListener('contextmenu', () => { })
      window.removeEventListener('blur', () => { })
      window.removeEventListener("keydown", () => { })
    }
  }, [])

  useSessions(async (sessions: Session[]) => {
    const { id: windowId } = await chrome.windows.getCurrent({ populate: true })
    if (!actions.window.checkId(windowId)) return

    const tabs = await actions.window.getTabs(windowId)
    setTabs(tabs)

    const currentSession = sessions.find(session => session.windowId === windowId)
    if (currentSession) {
      setViewTitle(currentSession.title)
    } else {
      setViewTitle('Unsaved Window')
    }
    if (selectedTabs.length == 0) {
      const activeTab = await chrome.tabs.query({ active: true, currentWindow: true })
      setSelectedTabs(activeTab.map(tab => tab.id))
    }
  })

  const [draggedId, setDraggedId] = useState<number>()

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    chrome.tabs.move(draggedId, { index })
  }

  return (
    <div className='side-panel-tabs'>
      <AnimatePresence>

        {showContext &&
          <ContextMenu
            x={contextPos.x}
            y={contextPos.y}
            tab={contextTab}
            selectedTabIds={selectedTabs}
            contextRef={contextRef} />
        }
      </AnimatePresence>

      <div className='view-title session-title'>{viewTitle}</div>

      <div className="tabs-container" ref={scrollRef}>
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
      <div className="new-tab" onClick={newTabClickHandler}><MdAdd /> Create a new tab</div>
    </div>
  )
}

export default SidePanelTabs;