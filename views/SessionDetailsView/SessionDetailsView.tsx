import useSessions from "~hooks/useSessions"
import './SessionDetailsView.scss'
import { useParams } from "~node_modules/react-router/dist"
import { useState } from "react"
import { MdClose, MdDelete, MdOpenInBrowser } from "~node_modules/react-icons/md"
import { FaArrowRightToBracket } from "~node_modules/react-icons/fa6"
import store from "~store"
import actions from "~actions"
import faviconURL from "~utils/faviconUrl"

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
                      await actions.session.moveTabs(selectedSession, s, movingTabs)
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
                <div key={t.id}
                  className={selectedTabIds.includes(t.id) ? "tab selected" : "tab"}
                  onClick={() => {
                    if (selectedTabIds.includes(t.id)) {
                      setSelectedTabIds(c => c.filter(id => id !== t.id))
                    } else {
                      setSelectedTabIds(c => [...c, t.id])
                    }
                  }}>
                  <img src={faviconURL(t.url)} />
                  <div className="tab-details-container">
                    <div className="title">{t.title}</div>
                    <div className="url">{t.url}</div>
                  </div>
                </div>
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
                  }}>
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
                  }}>
                  <MdOpenInBrowser />
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