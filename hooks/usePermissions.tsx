import { useEffect, useState } from "react"
import store from "~store";
import isFirefox from "~utils/isFirefox"

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
      const tasks: Promise<boolean>[] = [
        chrome.permissions.contains({ permissions: ["downloads"] }),
        chrome.permissions.contains({ permissions: ["history"] }),
      ]

      const hasDisplayCheck = !isFirefox()
      if (hasDisplayCheck) {
        tasks.push(chrome.permissions.contains({ permissions: ["system.display"] }))
      }

      const results = await Promise.allSettled(tasks)

      const downloadsPermission = results[0]
      const historyPermission = results[1]
      const displayPermission = hasDisplayCheck ? results[2] : undefined

      _setPermissions({
        downloads: downloadsPermission.status === "fulfilled" && downloadsPermission.value,
        history: historyPermission.status === "fulfilled" && historyPermission.value,
        display: hasDisplayCheck
          ? (displayPermission?.status === "fulfilled" && displayPermission.value)
          : false
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