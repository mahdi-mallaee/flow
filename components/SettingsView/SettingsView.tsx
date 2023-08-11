import Dropdown from '~components/Dropdown'
import './SettingsView.scss'
import { Theme, type Settings, DefaultSettings, type WindowState } from '~utils/types'
import { useStorage } from '@plasmohq/storage/hook'
import { Storage } from '@plasmohq/storage'
import ToggleSwitch from '~components/ToggleSwitch'

const SettignsView = () => {
  const [settings, setSettings] = useStorage<Settings>({
    key: "settings",
    instance: new Storage({
      area: "local"
    })
  }, DefaultSettings)

  const newSessionWindowStateDropdownOptions = [
    { value: 'normal', label: "Normal" },
    { value: 'minimized', label: "Minimized" },
    { value: 'maximized', label: "Maximized" },
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
      <div className='settings-title'>Settings</div>
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