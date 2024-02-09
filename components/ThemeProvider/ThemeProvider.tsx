import { useEffect, type ReactNode, useState } from "react"
import useSettings from "~hooks/useSettings"
import { Theme } from "~utils/types"
import '../../utils/colors.css'

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const settings = useSettings()

  const [theme, setTheme] = useState<Theme>(settings.theme)

  const getOSTheme = (): Theme => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return Theme.dark
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