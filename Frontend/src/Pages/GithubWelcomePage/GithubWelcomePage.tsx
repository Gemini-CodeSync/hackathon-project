import { useEffect } from 'react';
import './GithubWelcomePage.css'
import { useLocation, useNavigate } from 'react-router';

const GithubWelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const extractedUsername = location.state?.username;

  useEffect(()=>{
    console.log("Extracted Username:", extractedUsername);
  }, [extractedUsername])


  async function getUserRepo(){
    chrome.storage.local.get('accessToken', async function(result){
      if(result.accessToken){
        const response = await fetch("http://localhost:3000/getUserRepos",{
          method:"GET",
          headers:{
            "Authorization": `Bearer ${result.accessToken}`
          }
        })

        const data = await response.json();
        console.log(data);

        const extractedData: { fullName: string, htmlUrl: string }[] = [];

        data.forEach((element: any) => {
          console.log(element['full_name']);
          console.log(element['html_url']);

          const fullName: string = element['full_name'] || '';
          const htmlUrl: string = element['html_url'] || '';

          extractedData.push({fullName, htmlUrl});
        });

        console.log(extractedData);

       navigate('#/privateRepo', {state: {extractedData}});
        
      }
    })}


  function removeUserToken(){
    chrome.storage.local.remove('accessToken', () => {
      console.log('Access token removed from local storage');
    });
  }

  return (
    <>
      <h1 className='first-h1'>Hello, {extractedUsername}</h1>
      <h1 className='second-h1'> Let's take advantage of premium features</h1>

      <button className='scan-btn my-btn'>Scan Now</button><br/>
      
      <p className='home-p github-p'>Please choose one of the premium features</p><br/>
      <button className='public-repo'><a href="#/publicRepo" className='public-repo-a'>Import Public Github Repositories</a></button><br/>
      <p className='home-p github-p or' style={{textAlign:"center", fontWeight:"bold", marginTop:"10px", fontSize:"16px"}}>OR</p><br/>

      <button className='private-repo' onClick={getUserRepo}><a href="#/privateRepo" className='private-repo-a'>Import Private Github Repositories</a></button><br/>

     <p className="home-p" style={{marginBottom:'0px'}}>Tasks finished? Time to sign out! </p>
     <button className='scan-btn logout-btn' onClick={removeUserToken} ><a href='' className='logout-a'>Log Out</a></button><br/>
     
      <p className='home-p'>New to this extension? Let's check out some FAQs</p>
    </>
  )
}

export default GithubWelcomePage