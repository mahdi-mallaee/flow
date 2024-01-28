import { Routes, Route } from "react-router-dom"
import AboutUsView from "~components/AboutUsView"
import BackupsView from "~components/BackupsView"
import DonationView from "~components/DontationView"
import Header from "~components/Header"
import SessionsContainer from "~components/SessionsContainer"
import SettignsView from "~components/SettingsView"
import UnsavedWindowsContainer from "~components/UnsavedWindowsContainer"

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