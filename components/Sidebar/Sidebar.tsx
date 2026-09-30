import { useMemo, useState } from "react"
import { BiWindowOpen } from "react-icons/bi"
import { FaSnowflake } from "react-icons/fa"
import {
  MdAdd,
  MdClose,
  MdDone,
  MdOutlineDelete,
  MdPushPin,
  MdSearch
} from "react-icons/md"
import type { Session } from "~utils/types"
import "./Sidebar.scss"

interface SidebarProps {
  sessions: Session[]
  selectedSessionId: string
  sessionClickHandler: (session: Session) => void
  createSessionHandler?: (title: string) => Promise<void>
  deleteSessionHandler?: (session: Session) => void
  openSessionHandler?: (session: Session) => void
}

const Sidebar = ({
  sessions,
  selectedSessionId,
  sessionClickHandler,
  createSessionHandler,
  deleteSessionHandler,
  openSessionHandler
}: SidebarProps) => {
  const [filterText, setFilterText] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState("")

  const filteredSessions = useMemo(() => {
    if (!filterText.trim()) return sessions
    const query = filterText.toLowerCase()
    return sessions.filter((s) => s.title.toLowerCase().includes(query))
  }, [sessions, filterText])

  const handleCreateSubmit = async () => {
    if (createSessionHandler) {
      await createSessionHandler(newTitle.trim())
    }
    setNewTitle("")
    setIsCreating(false)
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="title-area">
          <span className="sessions-title">Sessions</span>
          <span className="session-count-badge">{sessions.length}</span>
        </div>
        <button
          className="new-session-btn"
          title="Create New Session"
          onClick={() => setIsCreating(true)}
        >
          <MdAdd />
          <span>New</span>
        </button>
      </div>

      {isCreating && (
        <div className="new-session-input-card">
          <input
            autoFocus
            type="text"
            placeholder="Session name..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateSubmit()
              if (e.key === "Escape") {
                setIsCreating(false)
                setNewTitle("")
              }
            }}
          />
          <div className="input-actions">
            <button
              className="confirm-btn"
              onClick={handleCreateSubmit}
              title="Save"
            >
              <MdDone />
            </button>
            <button
              className="cancel-btn"
              onClick={() => {
                setIsCreating(false)
                setNewTitle("")
              }}
              title="Cancel"
            >
              <MdClose />
            </button>
          </div>
        </div>
      )}

      {sessions.length > 4 && (
        <div className="sidebar-search">
          <MdSearch />
          <input
            type="text"
            placeholder="Filter sessions..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          {filterText && (
            <MdClose
              className="clear-icon"
              onClick={() => setFilterText("")}
            />
          )}
        </div>
      )}

      <div className="sessions-container">
        {filteredSessions.map((session) => {
          const isSelected = selectedSessionId === session.id
          return (
            <div
              className={`session ${isSelected ? "selected" : ""}`}
              key={session.id}
              onClick={() => sessionClickHandler(session)}
            >
              <div className={`tabs-count color-${session.colorCode}`}>
                {session.tabs.length <= 99 ? session.tabs.length : "99+"}
              </div>

              <div className="session-info">
                {(session.isOpen || session.freeze || session.main) && (
                  <div className="session-badges">
                    {session.isOpen && (
                      <span
                        className="status-dot open"
                        title={`Open in window #${session.windowId}`}
                      />
                    )}
                    {session.freeze && (
                      <span className="badge-icon freeze" title="Session Frozen">
                        <FaSnowflake />
                      </span>
                    )}
                    {session.main && (
                      <span className="badge-icon main" title="Main Session">
                        <MdPushPin />
                      </span>
                    )}
                  </div>
                )}
                <div className="session-name" title={session.title}>
                  {session.title}
                </div>
              </div>

              <div className="session-hover-actions">
                {openSessionHandler && (
                  <button
                    className="action-icon-btn"
                    title={session.isOpen ? "Focus Window" : "Open Session"}
                    onClick={(e) => {
                      e.stopPropagation()
                      openSessionHandler(session)
                    }}
                  >
                    <BiWindowOpen />
                  </button>
                )}
                {deleteSessionHandler && (
                  <button
                    className="action-icon-btn delete"
                    title="Delete Session"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSessionHandler(session)
                    }}
                  >
                    <MdOutlineDelete />
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {filteredSessions.length === 0 && sessions.length > 0 && (
          <div className="no-sessions-found">No sessions matching search</div>
        )}
      </div>
    </div>
  )
}

export default Sidebar