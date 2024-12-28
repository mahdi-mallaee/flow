import { useState } from "react";
import { MdSearch } from "react-icons/md";
import Header from "~components/Header";
import SearchView from "~views/SearchView";
import SessionsContainer from "~views/SessionsContainer";
import UnsavedWindowsContainer from "~views/UnsavedWindowsContainer";

export default function MainView() {

  const [showSearchView, setShowSearchView] = useState(false)


  return (
    <>
      <Header headerButtonPath="/settings" />
      {showSearchView ?
        <SearchView setShowSearchView={setShowSearchView} />
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
