import actions from "~actions"
import ToggleSwitch from "~components/ToggleSwitch"
import usePermissions from "~hooks/usePermissions"

const PermissionsView = () => {
  const { permissions, setPermissions } = usePermissions()

  const handlePermissionToggle = async (permission: string, checked: boolean, key?: string) => {
    if (checked) {
      const hasPermission = await actions.checkPermission(permission)
      if (hasPermission) {
        setPermissions(prev => ({ ...prev, [key || permission]: true }))
        
      }
    } else {
      await chrome.permissions.remove({ permissions: [permission] })
      setPermissions(prev => ({ ...prev, [key || permission]: false }))
    }
  }

  return (
    <div className="settings-view">

      <div className='view-title'>Permissions</div>
      <div className="items-container">

        <div className="item">
          <div className="title">Downloads</div>
          <ToggleSwitch
            checked={permissions.downloads}
            onChange={(checked) => handlePermissionToggle("downloads", checked)}
          />
        </div>

        <div className="item">
          <div className="title">History</div>
          <ToggleSwitch
            checked={permissions.history}
            onChange={(checked) => handlePermissionToggle("history", checked)}
          />
        </div>

        <div className="item">
          <div className="title">Display</div>
          <ToggleSwitch
            checked={permissions.display}
            onChange={(checked) => handlePermissionToggle("system.display", checked, "display")}
          />
        </div>

      </div>
    </div>
  )
}

export default PermissionsView