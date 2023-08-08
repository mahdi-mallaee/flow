import Dropdown from '~components/Dropdown'
import './SettingsView.scss'
import { Theme, type Settings } from '~utils/types'
import { useStorage } from '@plasmohq/storage/hook'
import { Storage } from '@plasmohq/storage'

const SettignsView = () => {
  const [settings, setSettings] = useStorage<Settings>({
    key: "settings",
    instance: new Storage({
      area: "local"
    })
  }, {
    theme: Theme.light
  })

  return (
    <div className="settings-view">
      <div className='settings-title'>Settings</div>
      <div className="items-container">
        <div className="item">
          <div className="title">Theme</div>
          <Dropdown value={settings.theme} options={Object.values(Theme)} onChange={((option: Theme) => {
            setSettings(current => {
              return ({ ...current, theme: option })
            })
          })} />
        </div>
      </div>
    </div>
  )
}

export default SettignsView