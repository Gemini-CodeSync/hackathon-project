import './HomePage.css'
//import { useState } from 'react';

const HomePage = () => {
  //const [rerender, setRerender] = useState(false);

  function loginWithGithub(){
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=b8a3e4fb31ad799aa9b7&scope=repo`)
  }

  // function loginWithGithub(){
  //   const redirectUrl = chrome.identity.getRedirectURL('github');
  //   const authUrl = `https://github.com/login/oauth/authorize?client_id=b8a3e4fb31ad799aa9b7&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=repo`;
  
  //   console.log(redirectUrl, "redirectUrl");

  //   chrome.identity.launchWebAuthFlow({url: authUrl, interactive: true}, function(responseUrl) {
  //     if (chrome.runtime.lastError) {
  //       console.log("There was an error with the Web Authentication flow: ", chrome.runtime.lastError.message);
  //       console.log(chrome.runtime.lastError.message);
  //       return;
  //     }
  
  //     if(!responseUrl){
  //       console.log("No response from Github");
  //       return;
  //     }

  //     // Extract the code parameter from the response URL
  //     const urlParams = new URLSearchParams(new URL(responseUrl).search);
  //     const codeParam = urlParams.get('code');
  //     console.log(codeParam, "codeParam");
  
  //     if (codeParam && (localStorage.getItem('accessToken') === null)){
  //       async function getAccessToken() {
  //         await fetch("http://localhost:3000/getAccessToken?code=" + codeParam, {
  //           method: 'GET',
  //         })
  //         .then((response) => {
  //           return response.json();
  //         })
  //         .then((data) => {
  //           console.log(data);
  //           if(data.access_token){
  //             localStorage.setItem('accessToken', data.access_token);
  //             setRerender(!rerender);
  //           } 
  //         })
  //       }
  //       getAccessToken();
  //     }
  //   });
  // }
  
 

  return (
    <>
    <h1 className='first-h1'>Hello, User!</h1>
    <h1 className='second-h1'>Ready to Level Up Your Learning?</h1>

    <p className='home-p'>Hit Scan now and let the magic happen!</p>

    <button className='scan-btn'><a className='new-scan' href='#/screenshot'>Scan Now</a></button>

    <p className='home-p'><b>OR</b></p>

    {/* <button className='secondary-btn'><a href='#/github'>Sign in with Github</a></button> */}
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