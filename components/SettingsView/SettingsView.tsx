import Dropdown from '~components/Dropdown'
import './SettingsView.scss'
import { Theme, type Settings, DefaultSettings, type WindowState, type MainContentState, type BackupIntervalTime, StoreKeys } from '~utils/types'
import { useStorage } from '@plasmohq/storage/hook'
import { Storage } from '@plasmohq/storage'
import ToggleSwitch from '~components/ToggleSwitch'
import { MdChevronRight } from 'react-icons/md'
import runIntervalBakcups from '~actions/runIntervalBackups'

const SettignsView = ({ setMainContentState }: { setMainContentState: React.Dispatch<React.SetStateAction<MainContentState>> }) => {
  const [settings, setSettings] = useStorage<Settings>({
    key: StoreKeys.settings,
    instance: new Storage({
      area: "local"
    })
  }, DefaultSettings)

  const [autoBackupIntervalId] = useStorage({
    key: StoreKeys.autoBackupIntervalId,
    instance: new Storage({
      area: "local"
    })
  })

  const newSessionWindowStateDropdownOptions = [
    { value: 'normal', label: "Normal" },
    { value: 'minimized', label: "Minimized" },
    { value: 'maximized', label: "Maximized" },
  ]
  const autoBackupsIntervalDropdownOptions = [
    { value: '0', label: "Never" },
    { value: '10', label: "10 min" },
    { value: '30', label: "30 min" },
    { value: '60', label: "1 hour" },
    { value: '120', label: "2 hour" },
  ]

  const themeOptions = []
  Object.values(Theme).forEach((value, id) => {
    themeOptions.push({
      label: Object.keys(Theme)[id].toString(),
      value: value
    })
  })

  return (
    <div className="settings-view">
      <div className='view-title settings-title'>Settings</div>
      <div className="items-container">

        <div className="item">
          <div className="title">Theme</div>
          <Dropdown value={settings.theme} options={themeOptions}
            onChange={((option: Theme) => {
              setSettings(current => {
                return ({ ...current, theme: option })
              })
            })} />
        </div>

        <div className="item">
          <div className="title">Window size</div>
          <div className="new-window-state">
            <Dropdown
              value={settings.newSessionWindowState}
              options={newSessionWindowStateDropdownOptions}
              onChange={(option: WindowState) => {
                setSettings(current => {
                  return ({ ...current, newSessionWindowState: option })
                })
              }}
            />
          </div>
        </div>

        <div className="item">
          <div className="title">Automatic backups interval</div>
          <div className="auto-backups-interval">
            <Dropdown
              value={settings.autoBackupsInterval}
              options={autoBackupsIntervalDropdownOptions}
              onChange={(option: BackupIntervalTime) => {
                setSettings(current => {
                  return ({ ...current, autoBackupsInterval: option })
                }).then(() => {
                  console.log(autoBackupIntervalId)
                  if (autoBackupIntervalId) {
                    clearInterval(autoBackupIntervalId)
                    runIntervalBakcups()
                  }
                })
              }}
            />
          </div>
        </div>

        <div className="item">
          <div className="title">Creating window for new sessions</div>
          <div className="create-window-for-new-session">
            <ToggleSwitch checked={settings.createWindowForNewSession}
              onChange={(checked: boolean) => { setSettings(current => { return ({ ...current, createWindowForNewSession: checked }) }) }} />
          </div>
        </div>

        <div className="item">
          <div className="title">Opening a blank window on startup</div>
          <div className="create-window-for-new-session">
            <ToggleSwitch checked={settings.openingBlankWindowOnStratup}
              onChange={(checked: boolean) => {
                setSettings(current => { return ({ ...current, openingBlankWindowOnStratup: checked }) })
              }} />
          </div>
        </div>

        <div className="item">
          <div className="title">Create a new backup before deleting a session</div>
          <div>
            <ToggleSwitch checked={settings.createBackupBeforeSessionDelete}
              onChange={(checked: boolean) => {
                setSettings(current => { return ({ ...current, createBackupBeforeSessionDelete: checked }) })
              }} />
          </div>
        </div>

        <div className="item">
          <div className="title">Create a new backup before loading a backup</div>
          <div>
            <ToggleSwitch checked={settings.createBackupBeforeLoad}
              onChange={(checked: boolean) => {
                setSettings(current => { return ({ ...current, createBackupBeforeLoad: checked }) })
              }} />
          </div>
        </div>

        <div className="item backups-nav" onClick={() => setMainContentState('backups')}>
          <div className="title">Backups</div>
          <div className="backups-view-button"><MdChevronRight /></div>
        </div>

        <div className="item">
          <div className="title">Reset settings to default</div>
          <div className="reset-button" onClick={() => { setSettings(DefaultSettings) }}>
            Reset
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettignsView