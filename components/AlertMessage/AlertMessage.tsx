import { useEffect } from "react"
import type { AlertMessage } from "~utils/types"
import './AlertMessage.scss'
import { AnimatePresence, motion } from "framer-motion"

const AlertMessageView = ({ message, setMessage }: { message: AlertMessage, setMessage: Function }) => {
  const ALERT_MESSAGE_DURATION = 3000
  const returnMessage: AlertMessage = {
    show: false,
    text: '',
    type: "info"
  }

  useEffect(() => {
    if (message.show) {
      setTimeout(() => {
        setMessage(returnMessage)
      }, ALERT_MESSAGE_DURATION)
    }
  }, [message.show])

  return (
    <>
      <div className="alert-message-container">
        <AnimatePresence>
          {message.show &&
            <motion.div className={`message ${message.type}`}
              initial={{ scaleX: 0.1, opacity: 0.4 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0.1, opacity: 0.4 }}
              transition={{ ease: 'easeOut', duration: 0.2 }}>
              {message.text}
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </>
  )
}

export default AlertMessageView