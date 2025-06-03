import { useEffect, useState } from "react"
import store from "~store";

interface Permssions {
  downloads: boolean;
  history: boolean;
  display: boolean;
}

const usePermissions = () => {

  const [permissions, _setPermissions] = useState<Permssions>({
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

      _setPermissions({
        downloads: downloadsPermission.status === "fulfilled" && downloadsPermission.value,
        history: historyPermission.status === "fulfilled" && historyPermission.value,
        display: displayPermission.status === "fulfilled" && displayPermission.value
      })
    }

    checkAllPermissions()
  }, [])

  const setPermissions = (permissions: Partial<Permssions>) => {
    if (typeof permissions?.display === "boolean") {
      if (!permissions.display) {
        store.settings.set({ saveWindowsPosition: false })
      }
    }
    if (typeof permissions?.history === "boolean") {
      if (!permissions.history) {
        store.settings.set({ clearHistoryAfterSessionOpening: false })
      }
    }

    _setPermissions(prev => ({ ...prev, ...permissions }))
  }

  return { permissions, setPermissions }
}

export default usePermissions