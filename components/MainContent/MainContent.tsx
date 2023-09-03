import { Routes, Route } from "react-router-dom"
import BackupsView from "~components/BackupsView"
import Header from "~components/Header"
import SessionsContainer from "~components/SessionsContainer"
import SettignsView from "~components/SettingsView"
import UnsavedWindowsContainer from "~components/UnsavedWindowsContainer"

const MainContent = () => {

  return (
    <Routes>
      <Route path="/" element={
        <>
          <Header settingsButtonPath="/settings" />
          <SessionsContainer />
          <UnsavedWindowsContainer />
        </>
      }>
      </Route>
      <Route path="/settings" element={
        <>
          <Header settingsButtonPath="/" />
          <SettignsView />
        </>
      }>
      </Route>
      <Route path="/backups" element={
        <>
          <Header settingsButtonPath="/settings" />
          <BackupsView />
        </>
      }>
      </Route>
    </Routes>
  )
}

export default MainContent