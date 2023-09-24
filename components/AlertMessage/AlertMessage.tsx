import type { AlertMessage } from "~utils/types"
import './AlertMessage.scss'
import { AnimatePresence, motion } from "framer-motion"

const AlertMessageView = ({ message, show }: { message: AlertMessage, show: boolean }) => {

  return (
    <>
      <div className="alert-message-container">
        <AnimatePresence>
          {show &&
            <motion.div className={`message ${message.type}`}
              initial={{ scaleX: 0.1, opacity: 0.4 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0.1, opacity: 0.4 }}
              transition={{ ease: 'easeOut', duration: 0.12 }}>
              {message.text}
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </>
  )
}

export default AlertMessageView