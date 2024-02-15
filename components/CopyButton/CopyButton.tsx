import { useState } from "react"
import './CopyButton.scss'

const CopyButton = ({ text }: { text: string }) => {
  const [buttonText, setButtonText] = useState('copy')

  const clickHandler = () => {
    navigator.clipboard.writeText(text)
    setButtonText('copied!')
  }

  return (
    <div className="copy-button" onClick={clickHandler}>
      {buttonText}
    </div>
  )
}

export default CopyButton