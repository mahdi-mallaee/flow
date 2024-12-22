import { MdClose, MdSearch } from "react-icons/md"
import { useEffect, useMemo, useState } from "react"
import useSessions from "~hooks/useSessions"
import './SearchView.scss'
import type { Tab } from "~utils/types"
import actions from "~actions"

const SearchView = ({ setShowSearchView }: { setShowSearchView: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [searchInput, setSearchInput] = useState('')
  const sessions = useSessions()

  const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchInput(searchInput)
    }, 200)

    return () => {
      clearTimeout(handler)
    }
  }, [searchInput])

  const tabClickHandler = async (tab: Tab) => {
    const session = sessions.find(s => s.tabs.includes(tab))
    if (session.isOpen) {
      chrome.windows.update(tab.windowId, { focused: true, })
      chrome.tabs.update(tab.id, { active: true, })
    } else {
      const windowId = await actions.message.openSession({ sessionId: session.id, exludedTabIndex: tab.index })
      chrome.windows.update(windowId, { focused: true, })
      const tabs = await actions.window.getTabs(windowId)
      await chrome.tabs.update(tabs[tab.index].id, { active: true, })
    }

  }

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


  return (
    <div className="search-view">
      <div className='view-title session-title '>
        <MdSearch></MdSearch>
        <input placeholder="Search for title or url ..." onChange={e => setSearchInput(e.target.value)} autoFocus />
        <MdClose onClick={() => setShowSearchView(false)}></MdClose>
      </div>
      {searchResults.length > 0 ?
        <div className="search-items-container">
          {searchResults.map((session) => (
            <div className="search-item" key={session.id} >
              <div className="search-session">{session.title}</div>
              <div className="search-tabs">
                {session.tabs.map((tab, i) => (
                  <div className="tab" onClick={() => tabClickHandler(tab)}>
                    <div className="title">{tab.title}</div>
                    <div className="url">{tab.url}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        :
        <div className="not-found">Could not find anything!</div>
      }
    </div>
  )
}

export default SearchView