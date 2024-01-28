import { Routes, Route } from "react-router-dom"
import AboutUsView from "~components/AboutUsView"
import BackupsView from "~components/BackupsView"
import DonationView from "~components/DontationView"
import Header from "~components/Header"
import SessionsContainer from "~components/SessionsContainer"
import SettignsView from "~components/SettingsView"
import UnsavedWindowsContainer from "~components/UnsavedWindowsContainer"

const MainContent = () => {

  return (
    <Routes>

      <Route path="/" element={<>
        <Header settingsButtonPath="/settings" />
        <SessionsContainer />
        <UnsavedWindowsContainer />
      </>} />

      <Route path="/settings" element={<>
        <Header settingsButtonPath="/" />
        <SettignsView />
      </>} />

      <Route path="/backups" element={<>
        <Header settingsButtonPath="/settings" />
        <BackupsView />
      </>} />

      <Route path="/backups" element={<>
        <Header settingsButtonPath="/settings" />
        <BackupsView />
      </>} />

      <Route path="/about-us" element={<>
        <Header settingsButtonPath="/settings" />
        <AboutUsView />
      </>} />
      
      <Route path="/donation" element={<>
        <Header settingsButtonPath="/settings" />
        <DonationView />
      </>} />

    </Routes>
  )
}

export default MainContent