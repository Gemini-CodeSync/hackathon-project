import { useState, useEffect } from 'react';

const GithubWelcomePage = () => {

  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    const queryStr = window.location.search;
    const urlParams = new URLSearchParams(queryStr);
    // const urlParams = new URLSearchParams(new URL(responseUrl).search);
    const codeParam = urlParams.get('code');
    // console.log(codeParam, "codeParam");

    if (codeParam && (localStorage.getItem('accessToken') === null)){
      async function getAccessToken() {
        await fetch("http://localhost:3000/getAccessToken?code=" + codeParam, {
          method: 'GET',
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if(data.access_token){
            localStorage.setItem('accessToken', data.access_token);
            setRerender(!rerender);
          } 
        })
      }
      getAccessToken();
    }

  },[]);

  async function getUserData(){
    await fetch("http://localhost:3000/getUserData", {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('accessToken')
      }
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
  }

  // const [accessToken, setAccessToken] = useState<string | null>(null);

  // useEffect(() => {
  //   chrome.storage.local.get('accessToken', (result) => {
  //     setAccessToken(result.accessToken);
  //   });
  // }, []);

  // // const getRepoData = (owner: string, repo: string) => {
  // //   if (!accessToken) {
  // //     console.log('No access token found');
  // //     return;
  // //   }

  // //   fetch(`https://api.github.com/repos/${owner}/${repo}`, {
  // //     headers: {
  // //       'Authorization': `token ${accessToken}`
  // //     }
  // //   })
  // //   .then((response: Response) => response.json())
  // //   .then((data: any) => {
  // //     console.log('Repository data:', data);
  // //   });
  // // }

  // const getAccessibleRepos = () => {
  //   if (!accessToken) {
  //     console.log('No access token found');
  //     return;
  //   }
  
  //   fetch(`https://api.github.com/user/repos`, {
  //     headers: {
  //       'Authorization': `token ${accessToken}`
  //     }
  //   })
  //   .then((response: Response) => response.json())
  //   .then((data: any) => {
  //     console.log('Accessible repositories:', data);
  //   });
  // }

  return (
    <>
      <h1>Hello, A</h1>
      <h1> Let's take advantage of premium features</h1>

      <button>Scan Now</button><br/>
      
      <p>Please choose one of the premium features</p><br/>
      <button>Import Public Github Repositories</button><br/>
      <p>OR</p><br/>
      {/* <button onClick={getAccessibleRepos}>Import Private Github Repositories</button><br/> */}
      <button onClick={getUserData}>Import Private Github Repositories</button><br/>
      
      <p>OR</p><br/>

     <button onClick={() => {localStorage.removeItem("accessToken");}}><a href=''>Log Out</a></button><br/>
      
      <p>New to this extension? Let's check out some FAQs</p>
    </>
  )
}

export default GithubWelcomePage