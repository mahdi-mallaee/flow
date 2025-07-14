import useSessions from "~hooks/useSessions"
import './SessionDetailsView.scss'
import { useParams } from "~node_modules/react-router-dom"
import { useState } from "react"
import { MdClose, MdDelete } from "~node_modules/react-icons/md"
import { BiWindowOpen } from "~node_modules/react-icons/bi"
import { FaArrowRightToBracket } from "~node_modules/react-icons/fa6"
import store from "~store"
import actions from "~actions"
import TabItem from "~components/TabItem"

const SessionDetailsView = () => {
  const { id } = useParams()
  const sessions = useSessions()
  const selectedSession = sessions?.find(s => s.id == id)
  const [selectedTabIds, setSelectedTabIds] = useState<number[]>([])
  const [moveToSession, setMoveToSession] = useState(false)

  return (
    <div className="session-details-view">
      <div className='view-title session-title '>
        {selectedSession?.title}
      </div>

      {
        moveToSession ?
          <div className="session">
            {sessions.map(s => {
              if (s.id === selectedSession.id) return null
              return (
                <div key={s.id}
                  className={s.isOpen ? 'session-container open' : 'session-container'}
                  onClick={async () => {
                    if (s.id !== selectedSession.id) {
                      const movingTabs = selectedSession.tabs.filter(t => selectedTabIds.includes(t.id))
                      await actions.session.moveTabs({ sourceSession: selectedSession, targetSession: s, tabs: movingTabs })
                      setSelectedTabIds([])
                      setMoveToSession(false)
                    }
                  }}>
                  <div className={`tabs-count color-${s.colorCode}`}>{s.tabs.length}</div>
                  <div className="title">{s.title}</div>
                </div>
              )
            })}
          </div>
          :
          <div className="tabs-container">
            {selectedSession?.tabs?.map(t => {
              return (
                <TabItem
                  key={t.id}
                  tab={t}
                  selected={selectedTabIds.includes(t.id)}
                  onClick={() => {
                    if (selectedTabIds.includes(t.id)) {
                      setSelectedTabIds(c => c.filter(id => id !== t.id))
                    } else {
                      setSelectedTabIds(c => [...c, t.id])
                    }
                  }} />
              )
            })}
          </div>
      }

      {
        selectedTabIds.length > 0 &&
        <div className="tab-actions">
          <div className="select-action"
            onClick={() => {
              if (moveToSession) return

              if (selectedTabIds.length < selectedSession.tabs.length) {
                setSelectedTabIds(selectedSession.tabs.map(t => t.id))
              } else {
                setSelectedTabIds([])
              }
            }}>
            {selectedTabIds.length} of {selectedSession?.tabs?.length || 0} selected
          </div>

          <div className="action-buttons-container">
            {!moveToSession &&
              <>
                <div className="icon-button"
                  onClick={async () => {
                    if (!selectedSession.isOpen) {
                      const newTabs = selectedSession.tabs.filter(t => !selectedTabIds.includes(t.id))
                      await store.sessions.setTabs(selectedSession.id, newTabs)
                      setSelectedTabIds([])
                    } else {
                      await chrome.tabs.remove(selectedTabIds)
                    }
                  }}
                  title="Delete selected tabs">
                  <MdDelete />
                </div>

                <div className="icon-button"
                  onClick={async () => {
                    const settings = await store.settings.getAll()
                    if (settings.openSessionInCurrentWindow) {
                      selectedTabIds.forEach(async id => {
                        const tab = selectedSession.tabs.find(t => t.id === id)
                        if (tab) {
                          await chrome.tabs.create({ url: tab.url, active: false })
                        }
                      })
                    } else {
                      const windowId = await actions.window.create()
                      if (actions.window.checkId(windowId)) {
                        await actions.window.update(windowId, selectedSession.tabs.filter(t => selectedTabIds.includes(t.id)), [])
                      }
                    }
                    setSelectedTabIds([])
                  }}
                  title="Open selected tabs">
                  <BiWindowOpen />
                </div>
              </>
            }

            <div className="icon-button"
              title="Move to another session"
              onClick={async () => {
                setMoveToSession(!moveToSession)
              }}>
              {moveToSession ?
                <MdClose />
                :
                <FaArrowRightToBracket />
              }
            </div>
          </div>

        </div>
      }

    </div >
  )
}

export default SessionDetailsView