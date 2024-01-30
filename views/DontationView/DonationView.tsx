import { useState } from 'react'
import './DonationView.scss'

const DonationView = () => {
  const [btcButtonText, setBtcButtonText] = useState('copy')
  const [ethButtonText, setEthButtonText] = useState('copy')
  const [ltcButtonText, setLtcButtonText] = useState('copy')

  const copyBtcAddress = () => {
    const btcAddress = "bc1qs57qa2urys0d8wxgjsprwa5xjqqscs8q9ek98n"
    navigator.clipboard.writeText(btcAddress)
    setBtcButtonText('copied!')
  }
  const copyEthAddress = () => {
    const ethAddress = "0x1EFC03903C4ccf9E1b37622654BEFFb03299ab47"
    navigator.clipboard.writeText(ethAddress)
    setEthButtonText('copied!')
  }
  const copyLtcAddress = () => {
    const ltcAddress = "ltc1qskd2deamjaqv3fupap4ckv5n5zpg5j4y8q6z66"
    navigator.clipboard.writeText(ltcAddress)
    setLtcButtonText('copied!')
  }

  return (
    <div className='donation-view'>
      <div className='view-title donation-title'>Donation</div>

      <div className='container'>
        <div>Your donations will ensure constant updates and improvements.</div>

        <div className='wallet-address'>
          <span>Bitcoin (BTC) wallet address</span>
          <div className='copy-button' onClick={() => copyBtcAddress()}>{btcButtonText}</div>
        </div>

        <div className='wallet-address'>
          <span>Etherium (ETH) wallet address</span>
          <div className='copy-button' onClick={() => copyEthAddress()}>{ethButtonText}</div>
        </div>

        <div className='wallet-address'>
          <span>LiteCoin (LTC) wallet address</span>
          <div className='copy-button' onClick={() => copyLtcAddress()}>{ltcButtonText}</div>
        </div>

        <div>Currently other payment methods are not available.</div>
        <div>Thanks for understanding.</div>
      </div>
    </div>
  )
}

export default DonationView