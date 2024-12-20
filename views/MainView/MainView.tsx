import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import Header from "~components/Header";
import useSessions from "~hooks/useSessions";
import SessionsContainer from "~views/SessionsContainer";
import UnsavedWindowsContainer from "~views/UnsavedWindowsContainer";

export default function MainView() {

  const [showSearchView, setShowSearchView] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const sessions = useSessions()

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
    <>
      <Header headerButtonPath="/settings" />
      {showSearchView ?
        <div className="search-view" style={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
          <div className='view-title session-title search-view'>
            <MdSearch></MdSearch>
            <input placeholder="Search for title or url ..." onChange={e => setSearchInput(e.target.value)} />
            <MdClose onClick={() => setShowSearchView(false)}></MdClose>
          </div>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
            {searchResults.length > 0 ?
              searchResults.map((session) => (
                <div className="session-container" key={session.id} >
                  <div className="session">{session.title}</div>
                  <div className="tabs" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {session.tabs.map((tab, i) => (
                      <div>
                        <div style={{ overflow: "hidden", textWrap: "nowrap", textOverflow: "ellipsis" }}>{highlightSearchInput(tab.title)}</div>
                        <div style={{ overflow: "hidden", textWrap: "nowrap", textOverflow: "ellipsis" }}>{highlightSearchInput(tab.url)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
              :
              <div>Could not find anything!</div>
            }
          </div>
        </div>
        :
        <>
          <div className='view-title session-title'>
            Sessions
            <MdSearch onClick={() => setShowSearchView(true)}></MdSearch>
          </div>
          <SessionsContainer />
          <UnsavedWindowsContainer />
        </>
      }
    </>
  )
}
