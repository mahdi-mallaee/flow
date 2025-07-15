import { Routes, Route } from "react-router-dom"
import AboutUsView from "~views/AboutUsView"
import BackupsView from "~views/BackupsView"
import DonationView from "~views/DontationView"
import Header from "~components/Header"
import SettignsView from "~views/SettingsView"
import AdditionalSettingsView from "./AdditionalSettingsView"
import MainView from "./MainView/MainView"
import SidePanelTabs from "./SidePanelTabs"

const ViewRouter = ({ isPopup = true }: { isPopup?: boolean }) => {

  return (
    <Routes>

      <Route path="/" element={<>{
        isPopup ?
          < MainView isPopup={isPopup} />
          :
          <SidePanelTabs />
      }</>} />

      <Route path="/settings" element={<>
        {isPopup && <Header headerButtonPath="/" />}
        <SettignsView />
      </>} />

      <Route path="/backups" element={<>
        {isPopup && <Header headerButtonPath="/settings" />}
        <BackupsView />
      </>} />

      <Route path="/about-us" element={<>
        {isPopup && <Header headerButtonPath="/settings" />}
        <AboutUsView />
      </>} />

      <Route path="/donation" element={<>
        {isPopup && <Header headerButtonPath="/settings" />}
        <DonationView />
      </>} />

      <Route path="/additional-settings" element={<>
        {isPopup && <Header headerButtonPath="/settings" />}
        <AdditionalSettingsView />
      </>} />

      <Route path='/main' element={<MainView isPopup={isPopup} />} />

    </Routes>
  )
}

export default ViewRouter