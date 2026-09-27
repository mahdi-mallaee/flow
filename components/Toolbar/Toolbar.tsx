import { useState, type Dispatch, type SetStateAction } from "react"
import { BiWindowOpen } from "react-icons/bi"
import { FaSnowflake } from "react-icons/fa"
import {
  MdChecklist,
  MdClose,
  MdDone,
  MdGridView,
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlinePushPin,
  MdPushPin,
  MdSearch,
  MdViewList
} from "react-icons/md"
import { NUMBER_OF_COLOR_CODES } from "~utils/constants"
import type { Session } from "~utils/types"
import "./Toolbar.scss"

interface ToolbarProps {
  session?: Session
  searchInput: string
  setSearchInput: Dispatch<SetStateAction<string>>
  onRenameSession?: (id: string, newTitle: string) => Promise<void>
  onColorChange?: (id: string, colorCode: number) => Promise<void>
  onToggleMain?: () => void
  onToggleFreeze?: () => void
  onOpenSession?: () => void
  onCloseSessionWindow?: () => void
  onDeleteSession?: () => void
  isSelectMode?: boolean
  onToggleSelectMode?: () => void
  viewMode?: "grid" | "list"
  onToggleViewMode?: () => void
}

const Toolbar = ({
  session,
  searchInput,
  setSearchInput,
  onRenameSession,
  onColorChange,
  onToggleMain,
  onToggleFreeze,
  onOpenSession,
  onCloseSessionWindow,
  onDeleteSession,
  isSelectMode,
  onToggleSelectMode,
  viewMode = "grid",
  onToggleViewMode
}: ToolbarProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const startEditing = () => {
    if (session) {
      setEditedTitle(session.title)
      setIsEditing(true)
    }
  }

  const handleSaveTitle = async () => {
    if (session && editedTitle.trim() && onRenameSession) {
      await onRenameSession(session.id, editedTitle.trim())
    }
    setIsEditing(false)
  }

  return (
    <div className="toolbar-container">
      <div className="toolbar-top">
        <div className="searchbar">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tabs across sessions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchInput("")}
              title="Clear search"
            >
              <MdClose />
            </button>
          )}
        </div>

        {session && (
          <div className="view-controls">
            <button
              className={`view-btn ${isSelectMode ? "active" : ""}`}
              onClick={onToggleSelectMode}
              title={isSelectMode ? "Exit Select Mode" : "Select Multiple Tabs"}
            >
              <MdChecklist />
              <span>Select</span>
            </button>

            <button
              className="view-btn"
              onClick={onToggleViewMode}
              title={viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"}
            >
              {viewMode === "grid" ? <MdViewList /> : <MdGridView />}
              <span>{viewMode === "grid" ? "List" : "Grid"}</span>
            </button>
          </div>
        )}
      </div>

      {session && (
        <div className="toolbar-session-row">
          <div className="session-identity">
            <div className="color-picker-wrapper">
              <div
                className={`color-badge color-${session.colorCode}`}
                title="Change session color"
                onClick={() => setShowColorPicker((v) => !v)}
              />
              {showColorPicker && (
                <div className="color-picker-popover">
                  {Array.from({ length: NUMBER_OF_COLOR_CODES }, (_, i) => i + 1).map((code) => (
                    <div
                      key={code}
                      className={`color-swatch color-${code} ${
                        session.colorCode === code ? "active" : ""
                      }`}
                      onClick={() => {
                        onColorChange?.(session.id, code)
                        setShowColorPicker(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="inline-title-editor">
                <input
                  autoFocus
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTitle()
                    if (e.key === "Escape") setIsEditing(false)
                  }}
                />
                <button
                  className="editor-btn confirm"
                  onClick={handleSaveTitle}
                  title="Save title"
                >
                  <MdDone />
                </button>
                <button
                  className="editor-btn cancel"
                  onClick={() => setIsEditing(false)}
                  title="Cancel"
                >
                  <MdClose />
                </button>
              </div>
            ) : (
              <div className="title-display-area" onDoubleClick={startEditing}>
                <span className="session-title" title={session.title}>
                  {session.title}
                </span>
                <button
                  className="title-edit-btn"
                  title="Rename session"
                  onClick={startEditing}
                >
                  <MdOutlineEdit />
                </button>
              </div>
            )}

            <div className="session-meta-tags">
              <span className="meta-tag">{session.tabs.length} tabs</span>
              {session.groups && session.groups.length > 0 && (
                <span className="meta-tag">{session.groups.length} groups</span>
              )}
              {session.isOpen ? (
                <span className="meta-tag status-open" title={`Open in Window #${session.windowId}`}>
                  <span className="status-dot" />
                  Window #{session.windowId}
                </span>
              ) : (
                <span className="meta-tag status-closed">Closed</span>
              )}
            </div>
          </div>

          <div className="session-actions-group">
            <button
              className="action-pill-btn open-btn"
              onClick={onOpenSession}
              title={session.isOpen ? "Focus Window" : "Open Session Window"}
            >
              <BiWindowOpen />
              <span>{session.isOpen ? "Focus Window" : "Open Window"}</span>
            </button>

            {session.isOpen && onCloseSessionWindow && (
              <button
                className="action-pill-btn close-window-btn"
                onClick={onCloseSessionWindow}
                title="Close Session Window"
              >
                <MdClose />
                <span>Close Window</span>
              </button>
            )}

            <button
              className={`action-pill-btn ${session.main ? "pinned" : ""}`}
              onClick={onToggleMain}
              title={session.main ? "Unpin Main Session" : "Pin as Main Session"}
            >
              {session.main ? <MdPushPin /> : <MdOutlinePushPin />}
              <span>Main</span>
            </button>

            <button
              className={`action-pill-btn freeze-btn ${session.freeze ? "frozen" : ""}`}
              onClick={onToggleFreeze}
              title={
                session.freeze
                  ? "Unfreeze Session (Auto-updates enabled)"
                  : "Freeze Session (Prevent auto-updates)"
              }
            >
              <FaSnowflake />
              <span>{session.freeze ? "Frozen" : "Freeze"}</span>
            </button>

            {onDeleteSession && (
              <button
                className="action-pill-btn delete-btn"
                onClick={onDeleteSession}
                title="Delete Session"
              >
                <MdOutlineDelete />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Toolbar