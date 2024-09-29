import Dropdown from "~components/Dropdown"
import ToggleSwitch from "~components/ToggleSwitch"
import useAlertMessage from "~hooks/useAlertMessage"
import useSettings from "~hooks/useSettings"
import store from "~store"
import type { Settings, WindowState } from "~utils/types"

const AdditionalSettingsView = () => {

  const { showAlert, renderAlert } = useAlertMessage()
  const settings = useSettings()

  const newSessionWindowStateDropdownOptions = [
    { value: 'normal', label: "Normal" },
    { value: 'minimized', label: "Minimized" },
    { value: 'maximized', label: "Maximized" },
  ]

  const setSettingsHandler = async (settings: Partial<Settings>) => {
    const result = await store.settings.set(settings)
    if (!result) {
      showAlert({ text: 'Settings update failed', type: 'error' })
    }
  }

  return (
    <div className="settings-view">

      {renderAlert()}

      <div className='view-title'>Additional Settings</div>
      <div className="items-container">

        <div className="item">
          <div className="title">
            Window size
            <div className="desc">Chose the default size to open windows</div>
          </div>
          <Dropdown
            value={settings.newSessionWindowState}
            options={newSessionWindowStateDropdownOptions}
            onChange={(option: WindowState) => setSettingsHandler({ newSessionWindowState: option })} />
        </div>

        <div className="item">
          <div className="title">
            Session Delete Backup
            <div className="desc">Create a new backup before deleting a session</div>
          </div>
          <ToggleSwitch checked={settings.createBackupBeforeSessionDelete}
            onChange={(checked) => setSettingsHandler({ createBackupBeforeSessionDelete: checked })} />
        </div>

        <div className="item">
          <div className="title">
            Empty Tabs
            <div className="desc">Delete empty tabs when opening a session</div>
          </div>
          <ToggleSwitch checked={settings.deleteNewTabsWhenOpeningSession}
            onChange={(checked) => setSettingsHandler({ deleteNewTabsWhenOpeningSession: checked })} />
        </div>

        <div className="item">
          <div className="title">Create sessions in the current window</div>
          <ToggleSwitch checked={settings.createSessionInCurrentWindow}
            onChange={(checked) => setSettingsHandler({ createSessionInCurrentWindow: checked })} />
        </div>

      </div>
    </div>
  )
}

export default AdditionalSettingsView