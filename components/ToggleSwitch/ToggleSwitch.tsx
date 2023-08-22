import './ToggleSwitch.scss'
import { useState, useEffect } from 'react'

const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => {
  const [transition, setTransition] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setTransition(true)
    }, 200)
  }, [])
  
  return (
    <div className="toggle-switch-container" aria-transition={transition} aria-checked={checked} onClick={() => {
      onChange(!checked)
    }}>
      <div className="switch"></div>
    </div>
  )
}

export default ToggleSwitch