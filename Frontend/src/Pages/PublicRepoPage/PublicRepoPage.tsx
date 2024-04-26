import { useEffect, useState } from 'react'
import './PublicRepoPage.css'

const PublicRepoPage = () => {
  const [repoLink, setRepoLink] = useState('');
  const [username, setUsername] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(()=>{
    chrome.storage.local.get("accessToken", async function(result){
      if(result.accessToken){
        const result_access_token = result.accessToken
        console.log("access token found:", result_access_token);
        setAccessToken(result_access_token)
      }})
    chrome.storage.local.get("username", async function(result){
      if(result.username){
        console.log("Username found:", result.username);
        setUsername(result.username);
      }
    })

  }, [])
 
  const sendRepoLink = async()=>{  
    const response = await fetch('http://localhost:3000/storeFiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({repoPath: repoLink, username: username, githubToken: accessToken}),
  })
  const data = await response.json()
  console.log(data);

  }

  return (
    <>
      <h1 className='second-h1'style={{marginTop:'8px', marginBottom:'4px'}}>Import from the vast world of open source :)</h1>

      <p className="home-p" style={{marginBottom:'0px'}}>Import from public github repository:</p><br/>
      <img className='gif-img' src='https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjVoc2lncG9zaWpjNWxybXo3a2Z1MWt1MWZucW83OWh2ZTlkd2gydiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BpGWitbFZflfSUYuZ9/200.webp' alt='animated-gif'></img><br/>

      <div className='input-box' style={{width:'85%', marginLeft: '10%', marginTop: '5px', marginBottom: "10px"}}>
        <input type="text" placeholder="Enter github link....." value={repoLink} onChange={(e)=>{setRepoLink(e.target.value)}} />
      </div>

      <button style={{marginLeft: '10%', marginRight: '8%', width:'32%'}}><a href='#/chatPage' style={{color:'white'}} onClick={sendRepoLink}>Proceed</a></button>
      <button><a href='#/github' style={{color:'white'}}>Return Home</a></button><br/>
      <p className="home-p">New to this extension? Let's check out some FAQs</p>
    </>
  )
}

export default PublicRepoPage