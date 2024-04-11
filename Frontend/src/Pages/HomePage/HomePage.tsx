import './HomePage.css'

const HomePage = () => {
  return (
    <>
    <h1 className='first-h1'>Hello, User!</h1>
    <h1 className='second-h1'>Ready to Level Up Your Learning?</h1>

    <p className='home-p'>Hit Scan now and let the magic happen!</p>

    <button className='scan-btn'><a className='new-scan' href='#/screenshot'>Scan Now</a></button>

    <p className='home-p'><b>OR</b></p>

    <button className='secondary-btn'><a href='#/github'>Sign in with Github</a></button>
    <p className='premium-feat'>*premium features</p><br/>

    <p className='home-p'>New to this extension? Let's check our some <a href='#'>FAQs</a></p>
  </>
  )
}

export default HomePage