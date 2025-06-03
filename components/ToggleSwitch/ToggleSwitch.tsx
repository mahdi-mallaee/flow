import './ToggleSwitch.scss'
import { useState, useEffect } from 'react'

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch = ({ checked, onChange, disabled }: ToggleSwitchProps) => {
  const [transition, setTransition] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setTransition(true)
    }, 200)
  }, [])

  return (
    <div className="toggle-switch-container"
      data-transition={transition}
      data-disabled={disabled}
      data-checked={checked}
      onClick={() => {
        if (!disabled) onChange(!checked)
      }}>
      <div className="switch"></div>
    </div>
  )
}

export default ToggleSwitch