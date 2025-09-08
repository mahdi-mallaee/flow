import actions from "~actions"
import ToggleSwitch from "~components/ToggleSwitch"
import usePermissions from "~hooks/usePermissions"
import isFirefox from "~utils/isFirefox"

const PermissionsView = () => {
  const { permissions, setPermissions } = usePermissions()

  const handlePermissionToggle = async (permission: string, checked: boolean, key?: string) => {
    if (checked) {
      const hasPermission = actions.checkPermission(permission)
      if (hasPermission) {
        setPermissions({ [key || permission]: true })
      }
    } else {
      await chrome.permissions.remove({ permissions: [permission] })
      setPermissions({ [key || permission]: false })
    }
  }

  return (
    <div className="settings-view">

      <div className='view-title'>Permissions</div>
      <div className="items-container">

        <div className="item">
          <div className="title">
            Downloads
            <div className="desc">This is required for downloading backups</div>
          </div>
          <ToggleSwitch
            checked={permissions.downloads}
            onChange={(checked) => handlePermissionToggle("downloads", checked)}
          />
        </div>

        <div className="item">
          <div className="title">
            History
            <div className="desc">This is required for cleaning up histroy after each session openning to reduce duplicates</div>
          </div>
          <ToggleSwitch
            checked={permissions.history}
            onChange={(checked) => handlePermissionToggle("history", checked)}
          />
        </div>

        {
          !isFirefox() &&
          <div className="item">
            <div className="title">
              Display
              <div className="desc">This is required for saving window positions and restoring them</div>
            </div>
            <ToggleSwitch
              checked={permissions.display}
              onChange={(checked) => handlePermissionToggle("system.display", checked, "display")}
            />
          </div>
        }

      </div>
    </div>
  )
}

export default PermissionsView