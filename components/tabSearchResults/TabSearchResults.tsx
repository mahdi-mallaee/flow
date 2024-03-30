import { useState, type ReactNode, useEffect } from "react";
import TabCard from "~components/TabCard";
import type { Session } from "~utils/types"
import './TabSearchResults.scss'

const TabSearchResults = ({ sessions, searchInput }: { sessions: Session[], searchInput: string }) => {
  const [searchResults, setSearchResults] = useState<Session[]>([])

  useEffect(() => {
    search()
  }, [searchInput])

  const search = () => {
    if (searchInput) {
      const result = sessions.map(session => {
        return {
          ...session,
          tabs: session.tabs.filter(tab =>
            tab.title.toLowerCase().includes(searchInput.toLowerCase()) ||
            tab.url.toLowerCase().includes(searchInput.toLowerCase()))
        }
      }).filter(session => session.tabs.length > 0)
      setSearchResults(result)
    } else {
      setSearchResults([])
    }
  }

  const highlightSearchInput = (text: string): ReactNode => {
    const parts = text.split(new RegExp(`(${searchInput})`, 'gi'));
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
      {
        searchResults.map((session) => (
          <div className="session-container">
            <div className="session">{session.title}</div>
            <div className="tabs">
              {session.tabs.map((tab, i) => (
                <TabCard key={i} tab={tab} session={session}
                  title={highlightSearchInput(tab.title)}
                  url={highlightSearchInput(tab.url)} />
              ))}
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default TabSearchResults;