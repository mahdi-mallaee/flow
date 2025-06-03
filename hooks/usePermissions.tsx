import { useEffect, useState } from "react"

const usePermissions = () => {

  const [permissions, setPermissions] = useState({
    downloads: false,
    history: false,
    display: false
  })

  useEffect(() => {
    const checkAllPermissions = async () => {
      const [downloadsPermission, historyPermission, displayPermission] = await Promise.allSettled([
        chrome.permissions.contains({ permissions: ["downloads"] }),
        chrome.permissions.contains({ permissions: ["history"] }),
        chrome.permissions.contains({ permissions: ["system.display"] }),
      ])

      setPermissions({
        downloads: downloadsPermission.status === "fulfilled" && downloadsPermission.value,
        history: historyPermission.status === "fulfilled" && historyPermission.value,
        display: displayPermission.status === "fulfilled" && displayPermission.value
      })
    }

    checkAllPermissions()
  }, [])

  return { permissions, setPermissions }
}

export default usePermissions