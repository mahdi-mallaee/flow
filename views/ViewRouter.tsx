import { Routes, Route } from "react-router-dom"
import AboutUsView from "~views/AboutUsView"
import BackupsView from "~views/BackupsView"
import DonationView from "~views/DontationView"
import Header from "~components/Header"
import SessionsContainer from "~views/SessionsContainer"
import SettignsView from "~views/SettingsView"
import UnsavedWindowsContainer from "~views/UnsavedWindowsContainer"

const ViewRouter = () => {

  return (
    <Routes>

      <Route path="/" element={<>
        <Header headerButtonPath="/settings" />
        <SessionsContainer />
        <UnsavedWindowsContainer />
      </>} />

      <Route path="/settings" element={<>
        <Header headerButtonPath="/" />
        <SettignsView />
      </>} />

      <Route path="/backups" element={<>
        <Header headerButtonPath="/settings" />
        <BackupsView />
      </>} />

      <Route path="/backups" element={<>
        <Header headerButtonPath="/settings" />
        <BackupsView />
      </>} />

      <Route path="/about-us" element={<>
        <Header headerButtonPath="/settings" />
        <AboutUsView />
      </>} />
      
      <Route path="/donation" element={<>
        <Header headerButtonPath="/settings" />
        <DonationView />
      </>} />

    </Routes>
  )
}

export default ViewRouter