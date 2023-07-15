import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, type ReactNode, useState } from "react"
import { Theme, type Settings } from "~utils/types"

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useStorage<Settings>({
    key: "settings",
    instance: new Storage({
      area: "local"
    })
  }, {
    theme: Theme.light
  })

  const [theme, setTheme] = useState<Theme>(settings.theme)

  const getOSTheme = (): Theme => {
    if (window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return Theme.dark
      } else {
        return Theme.light
      }
    } else {
      return Theme.light
    }
  }

  useEffect(() => {
    if (settings.theme === Theme.osDefault) {
      setTheme(getOSTheme())
    } else {
      setTheme(settings.theme)
    }
  }, [settings.theme])

  return (
    <div id="theme-provider" data-theme={theme}>
      {children}
    </div>
  )
}

export default ThemeProvider