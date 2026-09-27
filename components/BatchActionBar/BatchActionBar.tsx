import { useState } from "react"
import { BiWindowOpen } from "react-icons/bi"
import {
  MdClose,
  MdContentCopy,
  MdDeleteOutline,
  MdDriveFileMove
} from "react-icons/md"
import type { Session, Tab } from "~utils/types"
import "./BatchActionBar.scss"

interface BatchActionBarProps {
  selectedTabs: Tab[]
  totalTabsCount: number
  allSessions: Session[]
  currentSessionId: string
  onSelectAll: () => void
  onClearSelection: () => void
  onDeleteSelected: () => void
  onOpenSelected: () => void
  onMoveToSession: (targetSessionId: string) => void
}

const BatchActionBar = ({
  selectedTabs,
  totalTabsCount,
  allSessions,
  currentSessionId,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  onOpenSelected,
  onMoveToSession
}: BatchActionBarProps) => {
  const [showMoveDropdown, setShowMoveDropdown] = useState(false)
  const [copied, setCopied] = useState(false)

  const otherSessions = allSessions.filter((s) => s.id !== currentSessionId)
  const isAllSelected = selectedTabs.length === totalTabsCount && totalTabsCount > 0

  const handleCopyAllUrls = () => {
    const urls = selectedTabs
      .map((t) => t.url)
      .filter(Boolean)
      .join("\n")
    if (urls) {
      navigator.clipboard.writeText(urls)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <div className="batch-action-bar">
      <div className="selection-stats">
        <span className="count-label">
          <strong>{selectedTabs.length}</strong> of {totalTabsCount} selected
        </span>
        <button
          className="text-btn"
          onClick={isAllSelected ? onClearSelection : onSelectAll}
        >
          {isAllSelected ? "Deselect All" : "Select All"}
        </button>
      </div>

      <div className="actions-cluster">
        <button
          className="batch-btn"
          title="Open selected tabs in window"
          onClick={onOpenSelected}
        >
          <BiWindowOpen />
          <span>Open</span>
        </button>

        <button
          className={`batch-btn ${copied ? "copied" : ""}`}
          title="Copy selected tab URLs"
          onClick={handleCopyAllUrls}
        >
          <MdContentCopy />
          <span>{copied ? "Copied!" : "Copy URLs"}</span>
        </button>

        <div className="move-dropdown-wrapper">
          <button
            className={`batch-btn ${showMoveDropdown ? "active" : ""}`}
            title="Move selected tabs to another session"
            onClick={() => setShowMoveDropdown((v) => !v)}
            disabled={otherSessions.length === 0}
          >
            <MdDriveFileMove />
            <span>Move to...</span>
          </button>

          {showMoveDropdown && (
            <div className="move-dropdown-menu">
              <div className="menu-header">Select destination session</div>
              <div className="sessions-list">
                {otherSessions.map((session) => (
                  <div
                    key={session.id}
                    className="session-option"
                    onClick={() => {
                      onMoveToSession(session.id)
                      setShowMoveDropdown(false)
                    }}
                  >
                    <span className={`color-dot color-${session.colorCode}`} />
                    <span className="option-title">{session.title}</span>
                    <span className="option-count">({session.tabs.length})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          className="batch-btn danger"
          title="Delete selected tabs"
          onClick={onDeleteSelected}
        >
          <MdDeleteOutline />
          <span>Delete</span>
        </button>

        <button
          className="close-bar-btn"
          title="Cancel Selection"
          onClick={onClearSelection}
        >
          <MdClose />
        </button>
      </div>
    </div>
  )
}

export default BatchActionBar
