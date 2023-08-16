import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import BackupsView from "~components/BackupsView"
import SessionsContainer from "~components/SessionsContainer"
import SettignsView from "~components/SettingsView"
import UnsavedWindowsContainer from "~components/UnsavedWindowsContainer"
import type { MainContentState, Session } from "~utils/types"

const MainContent = ({ mainContentState, setMainContentState }:
  { mainContentState: MainContentState, setMainContentState: React.Dispatch<React.SetStateAction<MainContentState>> }) => {
  const [sessions, setSessions] = useStorage<Session[]>({
    key: "sessions",
    instance: new Storage({
      area: "local"
    })
  }, [])

  switch (mainContentState) {
    case 'sessions': {
      return (
        <>
          <SessionsContainer sessions={sessions} setSessions={setSessions} />
          <UnsavedWindowsContainer sessions={sessions} setSessions={setSessions} />
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