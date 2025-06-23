import useSessions from "~hooks/useSessions"
import './SessionDetailsView.scss'
import { useParams } from "~node_modules/react-router/dist"
import { useState } from "react"
import { MdDelete } from "~node_modules/react-icons/md"

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
              <div className="title">{t.title}</div>
              <div className="url">{t.url}</div>
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
          <div className="icon-button"><MdDelete /></div>
        </div>
      }

    </div>
  )
}

export default SessionDetailsView