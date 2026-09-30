import { useState, type MouseEvent, type ReactNode } from "react"
import {
  MdCheck,
  MdClose,
  MdContentCopy,
  MdPublic,
  MdPushPin
} from "react-icons/md"
import type { Tab } from "~utils/types"
import "./TabCard.scss"

interface TabCardProps {
  tab: Tab
  title?: ReactNode
  url?: ReactNode
  groupName?: string
  groupColor?: string
  isSelected?: boolean
  isSelectMode?: boolean
  onToggleSelect?: (tab: Tab) => void
  onClickHandler?: () => void
  onCloseHandler?: (tab: Tab, e: MouseEvent) => void
  viewMode?: "grid" | "list"
}

const TabCard = ({
  tab,
  title,
  url,
  groupName,
  groupColor,
  isSelected = false,
  isSelectMode = false,
  onToggleSelect,
  onClickHandler,
  onCloseHandler,
  viewMode = "grid"
}: TabCardProps) => {
  const [iconError, setIconError] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation()
    if (tab.url) {
      navigator.clipboard.writeText(tab.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleSelectClick = (e: MouseEvent) => {
    e.stopPropagation()
    if (onToggleSelect) {
      onToggleSelect(tab)
    }
  }

  const displayTitle = title || tab.title || tab.url || "Untitled Tab"
  const displayUrl = url || tab.url || ""

  return (
    <div
      className={`tab-card ${viewMode} ${tab.pinned ? "pinned" : ""} ${
        isSelected ? "selected" : ""
      } ${isSelectMode ? "select-mode" : ""}`}
      onClick={isSelectMode && onToggleSelect ? handleSelectClick : onClickHandler}
    >
      <div
        className={`checkbox-wrapper ${isSelected ? "checked" : ""}`}
        onClick={handleSelectClick}
        title={isSelected ? "Deselect tab" : "Select tab"}
      >
        <div className="custom-checkbox">
          {isSelected && <MdCheck />}
        </div>
      </div>

      <div className="favicon-wrapper">
        {!iconError && tab.iconUrl ? (
          <img
            src={tab.iconUrl}
            alt=""
            onError={() => setIconError(true)}
            loading="lazy"
          />
        ) : (
          <MdPublic className="fallback-favicon" />
        )}
      </div>

      <div className="info">
        <div className="title-row">
          {groupName && (
            <span
              className="group-badge"
              style={{
                borderColor: groupColor || "var(--outline-color)",
                color: groupColor || "inherit"
              }}
              title={`Tab Group: ${groupName}`}
            >
              {groupName}
            </span>
          )}
          <span
            className="title"
            title={typeof displayTitle === "string" ? displayTitle : undefined}
          >
            {displayTitle}
          </span>
          {tab.pinned && (
            <span className="pinned-badge" title="Pinned Tab">
              <MdPushPin className="pin-icon" />
              <span>Pinned</span>
            </span>
          )}
        </div>
        <div
          className="url"
          title={typeof displayUrl === "string" ? displayUrl : undefined}
        >
          {displayUrl}
        </div>
      </div>

      <div className="tab-actions">
        <button
          className={`tab-action-btn copy-btn ${copied ? "copied" : ""}`}
          title={copied ? "Copied!" : "Copy URL"}
          onClick={handleCopy}
        >
          <MdContentCopy />
          {copied && <span className="copied-tooltip">Copied!</span>}
        </button>

        {onCloseHandler && (
          <button
            className="tab-action-btn close-btn"
            title="Remove Tab"
            onClick={(e) => onCloseHandler(tab, e)}
          >
            <MdClose />
          </button>
        )}
      </div>
    </div>
  )
}

export default TabCard