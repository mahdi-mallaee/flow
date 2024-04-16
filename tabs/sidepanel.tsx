import ThemeProvider from "~components/ThemeProvider"
import './sidepanel.scss'
import { MemoryRouter } from "react-router-dom"
import ViewRouter from "~views/ViewRouter"

function SidePanel() {
  return (
    <ThemeProvider>
      <MemoryRouter>
        <div className="side-panel">
          <ViewRouter></ViewRouter>
        </div>
      </MemoryRouter>
    </ThemeProvider>
  )
}

export default SidePanel