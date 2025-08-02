import Dropdown from "~components/Dropdown"
import ToggleSwitch from "~components/ToggleSwitch"
import useAlertMessage from "~hooks/useAlertMessage"
import usePermissions from "~hooks/usePermissions"
import useSettings from "~hooks/useSettings"
import { useNavigate } from "react-router-dom"
import store from "~store"
import type { Settings, WindowState } from "~utils/types"
import actions from "~actions"

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

  const { permissions } = usePermissions()
  const nav = useNavigate()

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
            Show session badge
            <div className="desc">Shows session's first letter on the extension icon or N for not saved sessions</div>
          </div>
          <ToggleSwitch checked={settings.showSessionBadge}
            onChange={async (checked) => {
              if (checked) {
                const currentWindow = await chrome.windows.getCurrent()
                actions.window.setBadgeColors({ windowId: currentWindow.id })
              } else {
                chrome.action.setBadgeText({ text: '' })
              }
              setSettingsHandler({ showSessionBadge: checked })
            }} />
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

        <div className="item">
          <div className="title">
            Save window positions
            {!permissions.display &&
              <div className="desc warning">Display permission is not granted!</div>
            }
          </div>
          <ToggleSwitch checked={settings.saveWindowsPosition}
            disabled={!permissions.display}
            onChange={(checked) => {
              if (permissions.display) {
                setSettingsHandler({ saveWindowsPosition: checked })
              } else {
                nav('/permissions')
              }
            }} />
        </div>

        <div className="item">
          <div className="title">
            Clear history after opening a session
            {!permissions.history &&
              <div className="desc warning">History permission is not granted!</div>
            }
          </div>
          <ToggleSwitch checked={settings.clearHistoryAfterSessionOpening}
            disabled={!permissions.history}
            onChange={(checked) => {
              if (permissions.history) {
                setSettingsHandler({ clearHistoryAfterSessionOpening: checked })
              } else {
                nav('/permissions')
              }
            }} />
        </div>

      </div>
    </div>
  )
}

export default AdditionalSettingsView