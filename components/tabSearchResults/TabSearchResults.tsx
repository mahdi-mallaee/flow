import { useState, type ReactNode, useEffect, useMemo } from "react"
import TabCard from "~components/TabCard"
import type { Session } from "~utils/types"
import './TabSearchResults.scss'

const TabSearchResults = ({ sessions, searchInput }: { sessions: Session[], searchInput: string }) => {
  const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchInput(searchInput)
    }, 100)

    return () => {
      clearTimeout(handler)
    }
  }, [searchInput])

  const searchResults = useMemo(() => {
    if (debouncedSearchInput) {
      return sessions.map(session => {
        return {
          ...session,
          tabs: session.tabs.filter(tab =>
            (tab.title ? tab.title.toLowerCase().includes(debouncedSearchInput.toLowerCase()) : false) ||
            (tab.url ? tab.url.toLowerCase().includes(debouncedSearchInput.toLowerCase()) : false))
        }
      }).filter(session => session.tabs.length > 0)
    } else {
      return []
    }
  }, [debouncedSearchInput, sessions])

  const highlightSearchInput = (text: string): ReactNode => {
    if (!text) return

    const parts = text.split(new RegExp(`(${searchInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return (
      parts.map((part, i) =>
        part.toLowerCase() === searchInput.toLowerCase() ?
          <b style={{ backgroundColor: 'yellow' }} key={i}>{part}</b>
          :
          part
      )
    )
  }

  return (
    <div className="search-results">
      {searchResults.length > 0 ?
        searchResults.map((session) => (
          <div className="session-container" key={session.id}>
            <div className="session">{session.title}</div>
            <div className="tabs">
              {session.tabs.map((tab, i) => (
                <TabCard key={tab.id || i} tab={tab}
                  title={highlightSearchInput(tab.title)}
                  url={highlightSearchInput(tab.url)}
                  onClickHandler={() => { }} />
              ))}
            </div>
          </div>
        ))
        :
        <div>Could not find anything!</div>
      }
    </div>
  )
}

export default TabSearchResults