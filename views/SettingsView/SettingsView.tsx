import Dropdown from '~components/Dropdown'
import './SettingsView.scss'
import { Theme, type BackupIntervalTime, StoreKeys, type Settings, DefaultAction } from '~utils/types'
import { useStorage } from '@plasmohq/storage/hook'
import { Storage } from '@plasmohq/storage'
import ToggleSwitch from '~components/ToggleSwitch'
import { MdChevronRight, MdFavoriteBorder } from 'react-icons/md'
import store from '~store'
import useSettings from '~hooks/useSettings'
import { useNavigate } from 'react-router-dom'
import actions from '~actions'
import useAlertMessage from '~hooks/useAlertMessage'

const SettignsView = () => {
  const settings = useSettings()
  const nav = useNavigate()
  const { showAlert, renderAlert } = useAlertMessage()

  const [autoBackupIntervalId] = useStorage({
    key: StoreKeys.autoBackupIntervalId,
    instance: new Storage({
      area: "local"
    })
  })

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

  const defaultActionOptions = []
  Object.values(DefaultAction).forEach((value, id) => {
    defaultActionOptions.push({
      label: Object.keys(DefaultAction)[id].toString(),
      value: value
    })
  })

  const setSettingsHandler = async (settings: Partial<Settings>) => {
    const result = await store.settings.set(settings)
    if (!result) {
      showAlert({ text: 'Settings update failed', type: 'error' })
    }
  }

  const defaultActionHandler = async (option: DefaultAction) => {
    try {
      await setSettingsHandler({ defaultAction: option })

      const windowId = (await chrome.windows.getCurrent()).id || -1

      if (option === DefaultAction.popup) {
        await chrome.action.openPopup({ windowId })
        await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })
        await chrome.sidePanel.setOptions({ enabled: false, })
      } else {
        await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
        await chrome.sidePanel.setOptions({ enabled: true, })
        await chrome.sidePanel.open({ windowId })
      }
    } finally {
      return
    }
  }

  return (
    <div className="settings-view">

      {renderAlert()}

      <div className='view-title'>Settings</div>
      <div className="items-container">

        <div className="item nav" onClick={() => nav('/donation')}>
          <MdFavoriteBorder className='heart-icon' />
          <div className="title">Donation</div>
          <MdChevronRight />
        </div>

        <div className="item">
          <div className="title">Theme</div>
          <Dropdown
            value={settings.theme}
            options={themeOptions}
            onChange={(option: Theme) => setSettingsHandler({ theme: option })} />
        </div>

        <div className="item">
          <div className="title">Default Action</div>
          <Dropdown
            value={settings.defaultAction}
            options={defaultActionOptions}
            onChange={defaultActionHandler} />
        </div>

        <div className="item">
          <div className="title">Automatic backups interval</div>
          <Dropdown
            value={settings.autoBackupsInterval}
            options={autoBackupsIntervalDropdownOptions}
            onChange={(option: BackupIntervalTime) => {
              setSettingsHandler({ autoBackupsInterval: option })
                .then(() => {
                  if (autoBackupIntervalId) {
                    clearInterval(autoBackupIntervalId)
                    actions.backup.runInterval()
                  }
                })
            }}
          />
        </div>

        <div className="item">
          <div className="title">
            Zen Mode
            <div className="desc">Open sessions in current window</div>
          </div>
          <ToggleSwitch checked={settings.openSessionInCurrentWindow}
            onChange={(checked) => {
              setSettingsHandler({ openSessionInCurrentWindow: checked })
            }} />
        </div>

        <div className="item nav" onClick={() => nav('/additional-settings')}>
          <div className="title">Additional Settings</div>
          <MdChevronRight />
        </div>

        <div className="item nav" onClick={() => nav('/backups')}>
          <div className="title">Backups</div>
          <MdChevronRight />
        </div>

        <div className="item nav" onClick={() => nav('/about-us')}>
          <div className="title">About Us</div>
          <MdChevronRight />
        </div>

        <div className="item">
          <div className="title">Reset settings to default</div>
          <div className="reset-button" onClick={() => store.settings.reset()}>Reset</div>
        </div>
      </div>
    </div>
  )
}

export default SettignsView