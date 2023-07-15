import { useEffect } from "react"
import type { AlertMessage } from "~utils/types"
import './AlertMessage.scss'

const AlertMessageView = ({ message, setMessage }: { message: AlertMessage, setMessage: Function }) => {
  const ALERT_MESSAGE_DURATION = 3000
  const returnMessage: AlertMessage = {
    show: false,
    text: '',
    type: "info"
  }

  useEffect(() => {
    if (!message.show) {
      setTimeout(() => {
        setMessage(returnMessage)
      }, ALERT_MESSAGE_DURATION)
    }
  }, [message.show])

  return (
    <>
      <div className="alert-message-container">
        {message.show &&
          <div className={`message ${message.type}`}>{message.text}</div>
        }
      </div>
    </>
  )
}

export default AlertMessageView