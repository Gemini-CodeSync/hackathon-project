import { useLocation } from 'react-router';
import './PrivateRepoPage.css'
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState, useEffect } from 'react';

const PrivateRepoPage = () => {
  const location = useLocation();
  const extractedData = location.state?.extractedData || [];

  const [privateRepoLink, setPrivateRepoLink] = useState('');
  const [username, setUsername] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [branchName, setBranchName] = useState('');
  const [loading, setLoading] = useState(false); 

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
 
 
  const sendPrivateRepoLink = async()=>{
    setLoading(true);
    const response = await fetch('http://localhost:3000/storeFiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({repoPath: privateRepoLink, username: username, githubToken: accessToken, branch: branchName}),
    })
    console.log(response);
    setLoading(false);
    window.location.href='#/chatPage';

  }

  return (
    <>
      <h1 className="second-h1" style={{marginTop:'10px', marginBottom:'4px'}}> Let's help decipher your private code securely :)</h1>

      <p className='home-p' style={{marginBottom:'0px'}}>Import from my private github repository:</p><br/>
      <img className='private-repo-gif' src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmx5amFzcGw3cW40bW5yYzI0bG9vOXNyNHQ3dmVrMnQyOHQ5M2g0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iFxXouCf76ZencqIRP/giphy.gif' alt='animated-gif'/><br/>

      <select onChange={(e)=>{setPrivateRepoLink(e.target.value)}}>
      <option>Select your repo</option>
      {extractedData.map((repo: { htmlUrl: string | number | readonly string[] | undefined; fullName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
        <option key={index} value={repo.htmlUrl}>{repo.fullName}</option>
      ))}
    </select>

    <div className='input-box' style={{width:'85%', marginLeft: '10%', marginTop: '5px', marginBottom: "10px"}}>
        <input type="text" placeholder="Enter the exact branch name" value={branchName} onChange={(e)=>{setBranchName(e.target.value)}} />
    </div>

      <button style={{marginLeft:'29px', width:'35%', marginRight: '25px'}}>
        {loading ? ( 
          <a style={{color:'white'}}>Importing....</a>
        ) : (
          <a href='#/chatPage' style={{color:'white'}}  onClick={sendPrivateRepoLink}>Proceed</a>
        )}
      </button>
      <button><a href="#/github" style={{color:'white'}}>Return Home</a></button><br/>
      <p className="home-p">New to this extension? Let's check out some FAQs</p> 
    </>
  )
}

export default PrivateRepoPage