import useSessions from "~hooks/useSessions"
import './SessionDetailsView.scss'
import { useParams } from "~node_modules/react-router/dist"
import { useState } from "react"
import { MdDelete, MdOpenInBrowser } from "~node_modules/react-icons/md"
import store from "~store"
import actions from "~actions"

const SessionDetailsView = () => {
  const { id } = useParams()
  const session = useSessions()?.find(s => s.id == id)
  const [selectedTabIds, setSelectedTabIds] = useState<number[]>([])

  return (
    <div className="session-details-view">
      <div className='view-title session-title '>
        {session?.title}
      </div>

      <div className="tabs-container">
        {session?.tabs?.map(t => {
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
              <img src={t.iconUrl} />
              <div className="tab-details-container">
                <div className="title">{t.title}</div>
                <div className="url">{t.url}</div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedTabIds.length > 0 &&
        <div className="tab-actions">
          <div className="select-action"
            onClick={() => {
              if (selectedTabIds.length < session.tabs.length) {
                setSelectedTabIds(session.tabs.map(t => t.id))
              } else {
                setSelectedTabIds([])
              }
            }}>
            {selectedTabIds.length} of {session?.tabs?.length || 0} selected
          </div>

          <div className="action-buttons-container">
            <div className="icon-button"
              onClick={async () => {
                if (!session.isOpen) {
                  const newTabs = session.tabs.filter(t => !selectedTabIds.includes(t.id))
                  await store.sessions.setTabs(session.id, newTabs)
                  setSelectedTabIds([])
                } else {
                  await chrome.tabs.remove(selectedTabIds)
                }
              }}>
              <MdDelete />
            </div>

            <div className="icon-button"
              onClick={async () => {
                const windowId = await actions.window.create()
                if (actions.window.checkId(windowId)) {
                  await actions.window.update(windowId, session.tabs.filter(t => selectedTabIds.includes(t.id)), [])
                }
              }}>
              <MdOpenInBrowser />
            </div>
          </div>

        </div>
      }

    </div>
  )
}

export default SessionDetailsView