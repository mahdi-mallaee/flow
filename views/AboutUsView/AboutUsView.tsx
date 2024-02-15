import CopyButton from '~components/CopyButton'
import './AboutUsView.scss'
import { EMAIL } from '~utils/constants'

const AboutUsView = () => {
  return (
    <div className="about-us-view">
      <div className='view-title about-us-title'>About Us</div>
      <div className="items-container">

        <div className='item'>
          If you encounter any bug in the extension or any problem in your experience
          we would be happy to receive your email about it so we could fix it or address the problem.
        </div>

        <div className='item'>
          Any feedback would be appreciated.
        </div>

        <div className="item">
          <div className="title">Developer :</div>
          <div>Mahdi Mallaee</div>
        </div>

        <div className="item">
          <div className="title">Designer :</div>
          <div>Mohammad Mallaee</div>
        </div>

        <div className="item email">
          <div className='text'>
            <div className="title">Email :</div>
            <div>flow.extension@gmail.com</div>
          </div>
          <CopyButton text={EMAIL}/>
        </div>

      </div>
    </div>
  )
}

export default AboutUsView