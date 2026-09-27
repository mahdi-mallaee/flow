import { useEffect, useMemo, useState, type ReactNode } from "react"
import { MdSearchOff } from "react-icons/md"
import actions from "~actions"
import TabCard from "~components/TabCard"
import type { Session, Tab } from "~utils/types"
import "./TabSearchResults.scss"

interface TabSearchResultsProps {
  sessions: Session[]
  searchInput: string
  onSelectSession?: (session: Session) => void
}

const TabSearchResults = ({
  sessions,
  searchInput,
  onSelectSession
}: TabSearchResultsProps) => {
  const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchInput(searchInput)
    }, 120)

    return () => clearTimeout(handler)
  }, [searchInput])

  const searchResults = useMemo(() => {
    if (!debouncedSearchInput.trim()) return []
    const query = debouncedSearchInput.toLowerCase().trim()

    return sessions
      .map((session) => ({
        ...session,
        tabs: session.tabs.filter(
          (tab) =>
            (tab.title && tab.title.toLowerCase().includes(query)) ||
            (tab.url && tab.url.toLowerCase().includes(query))
        )
      }))
      .filter((session) => session.tabs.length > 0)
  }, [debouncedSearchInput, sessions])

  const highlightSearchInput = (text?: string): ReactNode => {
    if (!text) return null
    if (!debouncedSearchInput.trim()) return text

    const parts = text.split(
      new RegExp(`(${debouncedSearchInput.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    )

    return parts.map((part, i) =>
      part.toLowerCase() === debouncedSearchInput.toLowerCase() ? (
        <mark className="search-highlight" key={i}>
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const handleTabClick = async (session: Session, tab: Tab) => {
    if (session.isOpen) {
      if (actions.window.checkId(session.windowId)) {
        await chrome.windows.update(session.windowId, { focused: true })
      }
      if (tab.id && tab.id > 0) {
        await chrome.tabs.update(tab.id, { active: true })
      }
    } else {
      await actions.session.open(session.id, false, undefined, tab.index)
    }
  }

  const totalMatches = useMemo(() => {
    return searchResults.reduce((acc, curr) => acc + curr.tabs.length, 0)
  }, [searchResults])

  return (
    <div className="search-results-page">
      <div className="search-summary">
        Found {totalMatches} tab{totalMatches === 1 ? "" : "s"} across {searchResults.length} session{searchResults.length === 1 ? "" : "s"}
      </div>

      {searchResults.length > 0 ? (
        searchResults.map((session) => (
          <div className="search-session-group" key={session.id}>
            <div
              className="session-header"
              onClick={() => onSelectSession?.(session)}
              title="Click to view full session"
            >
              <span className={`session-pill color-${session.colorCode}`}>
                {session.tabs.length} tabs
              </span>
              <span className="session-title">{session.title}</span>
              {session.isOpen && <span className="open-badge">Open</span>}
            </div>

            <div className="session-tabs-grid">
              {session.tabs.map((tab, i) => (
                <TabCard
                  key={tab.id || i}
                  tab={tab}
                  title={highlightSearchInput(tab.title)}
                  url={highlightSearchInput(tab.url)}
                  onClickHandler={() => handleTabClick(session, tab)}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="empty-search-state">
          <MdSearchOff className="empty-icon" />
          <div className="empty-title">No matching tabs found</div>
          <div className="empty-desc">
            No tabs match &quot;{debouncedSearchInput}&quot;
          </div>
        </div>
      )}
    </div>
  )
}

export default TabSearchResults