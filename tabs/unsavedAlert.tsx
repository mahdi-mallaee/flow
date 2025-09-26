import ThemeProvider from "~components/ThemeProvider"
import './unsavedAlert.scss'
import Logo from "~components/Logo"
import { useEffect, useState } from "react"
import actions from "~actions"
import store from "~store"

const UnsavedAlert = () => {
  type state = 'default' | 'saved-session' | 'error'
  const [UIState, setUIState] = useState<state>('default')

  const openMainPopup = async () => {
    await chrome.action.setPopup({ popup: "popup.html" })
    await chrome.action.openPopup()
  }

  const saveSessionHandler = async () => {
    const windowId = (await chrome.windows.getCurrent()).id
    const checkLimit = await actions.session.checkNumberLimit()
    if (!checkLimit) {
      setUIState('error')
      setTimeout(() => { openMainPopup() }, 6000)
      return
    }
    const result = await actions.session.create({ windowId: windowId })
    if (!result) {
      console.error("Session creation failed")
      setTimeout(() => { openMainPopup() }, 6000)
      setUIState('error')
      return
    }

    setUIState('saved-session')
    setTimeout(() => { window.close() }, 3000)

    actions.window.refreshUnsavedWindows()
    actions.session.refreshOpenSessions()
  }

  useEffect(() => {
    setTimeout(async () => {
      await chrome.action.setPopup({ popup: "popup.html" })
      window.close()
    }, 10000)
  }, [])

  const getUIState = () => {
    switch (UIState) {
      case 'default':
        return (
          <div className="default-state">
            <div>This window is not saved, you may want to catch it!</div>
            <div className="buttons">
              <div className="close-alert" onClick={async () => {
                await chrome.action.setPopup({ popup: "popup.html" })
                window.close()
              }}>No, Thanks</div>
              <div className="save-session" onClick={saveSessionHandler}>Yes, Please</div>
            </div>
          </div>
        )
      case 'saved-session':
        return (
          <div className="saved-session-state">
            <div>Session is now saved.</div>
            <div>You can see it in sessions list.</div>
          </div>
        )
      case 'error':
        return (
          <div className="error-state">
            <div>Could not save the session for some reason!</div>
            <div>You can do it manually in extension popup.</div>
          </div>
        )
    }
  }

  return (
    <ThemeProvider>
      <div className="unsaved-alert">
        <div className="logo-container">
          <Logo />
          Flow - Tab Manager
        </div>
        {
          getUIState()
        }
      </div>
    </ThemeProvider>
  )
}

export default UnsavedAlert