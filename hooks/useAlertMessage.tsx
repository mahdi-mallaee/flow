import AlertMessageView from "~components/AlertMessage/AlertMessage"
import { useState, useEffect } from 'react'
import type { AlertMessage } from "~utils/types"

const useAlertMessage = () => {
  const ALERT_MESSAGE_DURATION = 3000
  const returnMessage: AlertMessage = {
    text: '',
    type: "info"
  }

  const [show, setShow] = useState(false)

  const [message, setMessage] = useState<AlertMessage>({
    text: '',
    type: 'info'
  })

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setMessage(returnMessage)
      }, ALERT_MESSAGE_DURATION)
    }
  }, [show])

  const alertView = <AlertMessageView message={message} show={show}></AlertMessageView>

  return {
    showAlert: (message: AlertMessage) => {
      setMessage(message)
      setShow(true)
    },
    renderAlert: () => { return alertView }
  }
}

export default useAlertMessage