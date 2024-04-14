import './HomePage.css'
//import { useState } from 'react';

const HomePage = () => {

  function loginWithGithub(){
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=b8a3e4fb31ad799aa9b7&scope=repo`)
  }

  
  return (
    <>
    <h1 className='first-h1'>Hello, User!</h1>
    <h1 className='second-h1'>Ready to Level Up Your Learning?</h1>

    <p className='home-p'>Hit Scan now and let the magic happen!</p>

    <button className='scan-btn'><a className='new-scan' href='#/screenshot'>Scan Now</a></button>

    <p className='home-p'><b>OR</b></p>

    {localStorage.getItem('accessToken') 
    ? <button className='secondary-btn' onClick={loginWithGithub}><a href='#/github'>Continue with Github</a></button>
    : <button className='secondary-btn' onClick={loginWithGithub}><a href='#/github'>Sign in with Github</a></button> 
    }
    
    <p className='premium-feat'>*premium features</p><br/>

    <p className='home-p'>New to this extension? Let's check our some <a href='#'>FAQs</a></p>
  </>
  )
}

export default HomePage