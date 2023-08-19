import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import BackupsView from "~components/BackupsView"
import SessionsContainer from "~components/SessionsContainer"
import SettignsView from "~components/SettingsView"
import UnsavedWindowsContainer from "~components/UnsavedWindowsContainer"
import { DefaultSettings, StoreKeys, type MainContentState, type Session, type Settings } from "~utils/types"

const MainContent = ({ mainContentState, setMainContentState }:
  { mainContentState: MainContentState, setMainContentState: React.Dispatch<React.SetStateAction<MainContentState>> }) => {
  const [sessions, setSessions] = useStorage<Session[]>({
    key: StoreKeys.sessions,
    instance: new Storage({
      area: "local"
    })
  }, [])
  const [settings] = useStorage<Settings>({
    key: StoreKeys.settings,
    instance: new Storage({
      area: "local"
    })
  }, DefaultSettings)

  switch (mainContentState) {
    case 'sessions': {
      return (
        <>
          <SessionsContainer sessions={sessions} setSessions={setSessions} settings={settings} />
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