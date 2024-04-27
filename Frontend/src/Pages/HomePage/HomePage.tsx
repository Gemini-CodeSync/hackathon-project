import { useEffect, useState } from 'react';
import './HomePage.css'
import { useNavigate } from 'react-router';

const CLIENT_ID = import.meta.env.VITE_APP_CLIENT_ID;

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get('accessToken', (result) => {
      if (result.accessToken) {
        setIsLoggedIn(true);
      }
    });
  }, []);

  
  function loginWithGithub(){
    const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`

    chrome.identity.launchWebAuthFlow({
      url: AUTH_URL,
      interactive: true
    }, function(redirectUrl){
      if(redirectUrl){
        const urlParams = new URLSearchParams(new URL(redirectUrl).search);
        const codeParams = urlParams.get('code');

        if(codeParams){
          chrome.storage.local.get('accessToken', async function(result){
            if(!result.accessToken){
              const response = await fetch("http://localhost:3000/getAccessToken?code="+codeParams,{
                method:"GET"
              })

              const data = await response.json();
              console.log('DATA:', data);
              chrome.storage.local.set({ 'accessToken': data.access_token }, function(){
                if(chrome.runtime.lastError){
                  console.error("Error setting data: " + chrome.runtime.lastError.message);
                }else{
                  console.log("Data stored successfully");
                  setIsLoggedIn(true);
                  getUserData();
                }
              })
            }
          })
        }
      }
    })

  }

  async function getUserData(){
    chrome.storage.local.get('accessToken', async function(result){
      if(result.accessToken){
        const response = await fetch("http://localhost:3000/getUserData",{
          method:"GET",
          headers:{
            "Authorization": `Bearer ${result.accessToken}`
          }
        })

        const data = await response.json();
        console.log("THIS DATA:", data);
        const username = data.name;
        console.log("Username:", username);

        chrome.storage.local.set({ 'username': username }, function(){
          if(chrome.runtime.lastError){
            console.error("Error setting data: " + chrome.runtime.lastError.message);
          }else{
            console.log("Data stored successfully");
          }
        })


        navigate('#/github', {state: {username}});
        navigate('#/privateRepo', {state: {username}});
        navigate('#/publicRepo', {state: {username}});
        navigate('#/chatPage', {state: {username}});       
      }})
      window.location.href = '#/github';  
    }


  return (
    <>
      <h1 className='first-h1'>Hello, User!</h1>
      <h1 className='second-h1'>Ready to Level Up Your Learning?</h1>

      <p className='home-p'>Hit Scan now and let the magic happen!</p>

      <button className='scan-btn'><a className='new-scan' href='#/screenshot'>Scan Now</a></button>

      <p className='home-p'><b>OR</b></p>

      {isLoggedIn ? (
        <button className='secondary-btn' onClick={getUserData}><a href='#/github'>Continue with Github</a></button>
      ) : (
        <button className='secondary-btn' onClick={loginWithGithub}>Sign in with Github</button>
      )}      

      <p className='premium-feat'>*premium features</p><br/>

      <p className='home-p'>New to this extension? Let's check our some <a href='#'>FAQs</a></p>
    </>
  );
}

export default HomePage;
