import type { ReactNode } from "react"

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div id="theme-provider" data-theme={'light'}>
      {children}
    </div>
  )
}

export default ThemeProvider