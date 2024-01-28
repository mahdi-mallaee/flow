import { Storage } from '@plasmohq/storage';
import { useStorage } from '@plasmohq/storage/hook';
import css from 'data-text:./alert.css'
import React, { useState, useEffect } from 'react';
import { StoreKeys, type unsavedWindowAlertStatusId } from '~utils/types';

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = css
  return style
}

const alert = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [alertStatusId, setAlertStatusId] = useStorage<unsavedWindowAlertStatusId>(
    {
      instance: new Storage({ area: 'local' }),
      key: StoreKeys.unsavedWindowAlertStatusId
    },
    { windowId: -1, alertShown: false })

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'alert-ready' }, (response) => {
      if (response.action === 'alert-go') {
        setIsOpen(true)
        setAlertStatusId(c => { return { ...c, alertShown: true } })
      }
    })
  }, [alertStatusId.windowId])

  return (
    <div className={`newwindow-alert ${isOpen ? 'open' : 'closed'}`}>
      <div>This window is not saved you may wanna catch it!</div>
    </div>
  )
}

export default alert