import './AboutUsView.scss'

const AboutUsView = () => {
  return (
    <div className="about-us-view">
      <div className='view-title about-us-title'>About Us</div>
      <div className="items-container">

        <div className="item">
          <div className="title">Developer :</div>
          <div>Mahdi Mallaee</div>
        </div>
        
        <div className="item">
          <div className="title">Email :</div>
          <div>flow.extension@gmail.com</div>
        </div>
        
      </div>
    </div>
  )
}

export default AboutUsView