import { Storage } from '@plasmohq/storage';
import { useStorage } from '@plasmohq/storage/hook';
import css from 'data-text:./alert.css'
import colors from 'data-text:./../utils/colors.css'
import React, { useState, useEffect } from 'react';
import { Message, StoreKeys, type unsavedWindowAlertStatus } from '~utils/types';
import { AnimatePresence, motion } from 'framer-motion'
import ThemeProvider from '~components/ThemeProvider';

import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: []
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = colors
  style.textContent += css
  return style
}

const alert = () => {
  type state = 'default' | 'saved-session' | 'error' | 'closed'
  const [UIState, setUIState] = useState<state>('closed')
  const [alertStatus, setAlertStatus] = useStorage<unsavedWindowAlertStatus>(
    {
      instance: new Storage({ area: 'local' }),
      key: StoreKeys.unsavedWindowAlertStatus
    },
    { windowId: -1, alertShown: false })

  useEffect(() => {
    chrome.runtime.sendMessage({ message: Message.alertReady }, (response) => {
      if (response && response.message === Message.alertGo) {
        setUIState('default')
        setAlertStatus(c => { return { ...c, alertShown: true } })
        setTimeout(() => {
          setUIState('closed')
        }, 10000)
      }
    })
  }, [alertStatus.windowId])

  const saveSessionHandler = () => {
    chrome.runtime.sendMessage({ message: Message.saveSession }, (response) => {
      if (response && response.message === Message.success) {
        setUIState('saved-session')
        setTimeout(() => {
          setUIState('closed')
        }, 3000)
      } else {
        setUIState('error')
        setTimeout(() => {
          setUIState('closed')
        }, 6000)
      }
    })
  }

  const defaultUI = () => {
    return (
      <>
        <div>This window is not saved you may wanna catch it!</div>
        <div className="buttons">
          <div className="close-alert" onClick={() => setUIState('closed')}>No thanks!</div>
          <div className="save-session" onClick={saveSessionHandler}>Yes please!</div>
        </div>
      </>
    )
  }

  const savedSessionUI = () => {
    return (
      <>
        <div>Session is now saved.</div>
        <div>You can see it in extension popup.</div>
      </>
    )
  }

  const errorUI = () => {
    return (
      <>
        <div>Could not save the session for some reason!</div>
        <div>You can do it manually in extension popup.</div>
      </>
    )
  }

  const getCurrentUI = (state: state) => {
    switch (state) {
      case 'default':
        return defaultUI()
      case 'saved-session':
        return savedSessionUI()
      case 'error':
        return errorUI()
      default:
        return defaultUI()
    }
  }

  return (
    <ThemeProvider>
      <AnimatePresence>
        {(UIState !== 'closed') &&
          <motion.div className='newwindow-alert'
            initial={{ scaleY: 0.2, opacity: 0.4 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0.2 }}
            transition={{ ease: 'easeOut', duration: 0.12 }}>
            {getCurrentUI(UIState)}
          </motion.div>
        }
      </AnimatePresence>
    </ThemeProvider>
  )
}

export default alert