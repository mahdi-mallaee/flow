import { Routes, Route } from "react-router-dom"
import AboutUsView from "~views/AboutUsView"
import BackupsView from "~views/BackupsView"
import DonationView from "~views/DontationView"
import Header from "~components/Header"
import SettignsView from "~views/SettingsView"
import AdditionalSettingsView from "./AdditionalSettingsView"
import MainView from "./MainView/MainView"
import SessionDetailsView from "./SessionDetailsView"

const ViewRouter = () => {

  return (
    <Routes>

      <Route path="/" element={<MainView />} />

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

      <Route path="/additional-settings" element={<>
        <Header headerButtonPath="/settings" />
        <AdditionalSettingsView />
      </>} />

      <Route path="/session/:id" element={<>
        <Header headerButtonPath="/" />
        <SessionDetailsView />
      </>} />

    </Routes>
  )
}

export default ViewRouter