import BackupsView from "~components/BackupsView"
import SessionsContainer from "~components/SessionsContainer"
import SettignsView from "~components/SettingsView"
import UnsavedWindowsContainer from "~components/UnsavedWindowsContainer"
import { type MainContentState } from "~utils/types"

const MainContent = ({ mainContentState, setMainContentState }:
  { mainContentState: MainContentState, setMainContentState: React.Dispatch<React.SetStateAction<MainContentState>> }) => {

  switch (mainContentState) {
    case 'sessions': {
      return (
        <>
          <SessionsContainer />
          <UnsavedWindowsContainer />
        </>
      )
    }
    case "settings": {
      return (
        <SettignsView setMainContentState={setMainContentState} />
      )
    }
    case "backups": {
      return (
        <BackupsView />
      )
    }
    default: {
      setMainContentState('sessions')
    }
  }
}

export default MainContent