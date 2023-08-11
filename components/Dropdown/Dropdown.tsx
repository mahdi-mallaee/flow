import { useState } from "react"
import './Dropdown.scss'
import { AnimatePresence, motion } from "framer-motion"
import { MdArrowDropDown } from "react-icons/md"

type Option = {
  value: string,
  label: string
}

const Dropdown = ({ options, value, onChange }: { options: Option[], value: string, onChange: Function }) => {
  const [isActive, setIsActive] = useState(false)
  const maxWidth = Math.max(...options.map(option => option.label.length)) + 5
  const dropdownWidth = { width: maxWidth + 'ch' }
  const selectedOption = options.find(option => option.value === value)
  return (
    <>
      <div className="dropdown" style={dropdownWidth} onClick={() => { setIsActive(!isActive) }}>
        <div className="value-container">
          <div className="value">{selectedOption.label}</div>
          <MdArrowDropDown />
        </div>
        <AnimatePresence>
          {isActive &&
            <motion.div className="options"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.19 }}>
              {options.map((option, id) => {
                if (option.value !== selectedOption.value) {
                  return <div className="option" key={option.value} onClick={() => {
                    setIsActive(false)
                    onChange(option.value)
                  }}>{option.label}</div>
                }
              })}
            </motion.div>}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Dropdown