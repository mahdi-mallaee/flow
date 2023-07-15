import { useState } from "react"
import './Dropdown.scss'
import { AnimatePresence, motion } from "framer-motion"
import { MdArrowDropDown } from "react-icons/md"

const Dropdown = ({ options, value, onChange }: { options: string[], value: string, onChange: Function }) => {
  const [isActive, setIsActive] = useState(false)
  const maxWidth = Math.max(...options.map(option => option.length)) + 7
  const dropdownWidth = { width: maxWidth + 'ch' }
  return (
    <>
      <div className="dropdown" style={dropdownWidth}>
        <div className="value-container" onClick={() => { setIsActive(!isActive) }}>
          <div className="value">{value}</div>
          <MdArrowDropDown />
        </div>
        <AnimatePresence>
          {isActive &&
            <motion.div className="options"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.19 }}>
              {options.map(option => {
                if (option !== value) {
                  return <div className="option" key={option} onClick={() => {
                    setIsActive(false)
                    onChange(option)
                  }}>{option}</div>
                }
              })}
            </motion.div>}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Dropdown