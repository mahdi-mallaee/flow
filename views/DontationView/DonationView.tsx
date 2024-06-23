import './DonationView.scss'
import CopyButton from '~components/CopyButton'

const DonationView = () => {

  const btcAddress = "bc1qs57qa2urys0d8wxgjsprwa5xjqqscs8q9ek98n"
  const ethAddress = "0x1EFC03903C4ccf9E1b37622654BEFFb03299ab47"
  const ltcAddress = "ltc1qskd2deamjaqv3fupap4ckv5n5zpg5j4y8q6z66"
  const tonAddress = "UQCCZ6f08W50b34T9HeKWEj04IRmKsOgOs29jPfpWGThM48d"

  return (
    <div className='donation-view'>
      <div className='view-title donation-title'>Donation</div>

      <div className='container'>
        <div>Your donations will ensure constant updates and improvements.</div>

        <div className='wallet-address'>
          <span>TON (TON) wallet address (preferred)
            
          </span>
          <CopyButton text={tonAddress} />
        </div>

        <div className='wallet-address'>
          <span>Bitcoin (BTC) wallet address</span>
          <CopyButton text={btcAddress} />
        </div>

        <div className='wallet-address'>
          <span>Etherium (ETH) wallet address</span>
          <CopyButton text={ethAddress} />
        </div>

        <div className='wallet-address'>
          <span>LiteCoin (LTC) wallet address</span>
          <CopyButton text={ltcAddress} />
        </div>

        <div>Currently other payment methods are not available.</div>
        <div>Thanks for understanding.</div>
      </div>
    </div>
  )
}

export default DonationView