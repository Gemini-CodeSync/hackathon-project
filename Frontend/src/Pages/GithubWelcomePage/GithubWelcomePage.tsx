import { useState, useEffect } from 'react';
import ReactSelect from 'react-select';
import { getAllRepos, getUserRepos, fetchRepoContents, generateOutput } from "../../utils/fetchCode";
import { useContext } from 'react';
import { GlobalStateContext } from "../../contexts/GlobalStateContext"


const GithubWelcomePage = () => {

  const context = useContext(GlobalStateContext);

if (!context) {
  // context is null, handle the error
  throw new Error('GlobalStateContext is null');
}

  const { globalState, setGlobalState } = context;

  const [url, setUrl] = useState('');
 
  const options = globalState.repositories 
  ? globalState.repositories.map((repo: any, index: number) => ({ value: repo.name, label: repo.name, id: index }))
  : [];

  const publicOptions = globalState.publicRepos 
  ? globalState.publicRepos.map((repo: any, index: number) => ({ value: repo.name, label: repo.name, id: index }))
  : [];

  //Returns all personal repositories, public and private
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
            setGlobalState({...globalState, rerender: !globalState.rerender});
          } 
        })
      }
      getAccessToken();
    }
    getAllRepos(setGlobalState, globalState);
    getUserRepos(setGlobalState, globalState);

  },[]);


  // const handleSubmit = (event: any) => {
  //   event.preventDefault();
  //   chrome.tabs.create({ url });
  // };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    window.open(url, '_blank');
  };

  
  return (
    <>
      <h1>Hello, A</h1>
      <h1> Let's take advantage of premium features</h1>

      <button>Scan Now</button><br/>
      
      <p>Please choose one of the premium features</p><br/>
      
     
      {globalState.publicRepos && globalState.publicRepos.length > 0 && (
        <ReactSelect
          options={publicOptions}
          isSearchable
          onChange={(selectedOption: any) => {
            setGlobalState({...globalState, selectedRepo: selectedOption});
          }}
        />
      )}
      <br/>
      <button onClick={() => {fetchRepoContents(globalState.selectedRepo,globalState.repositories,setGlobalState, globalState)}}>Import Owned Public Github Repositories</button><br/>
      
      <p>OR</p><br/>
      {/* <button onClick={getAccessibleRepos}>Import Private Github Repositories</button><br/> */}
      {globalState.repositories && globalState.repositories.length > 0 && (
        <ReactSelect
          options={options}
          isSearchable
          onChange={(selectedOption: any) => {
            setGlobalState({...globalState, selectedRepo: selectedOption});
          }}
        />
      )}
      <br/>
      <button onClick={() => {fetchRepoContents(globalState.selectedRepo,globalState.repositories,setGlobalState, globalState)}}>Import Private Github Repository</button><br/>
      {/* //await generateOutput(setGlobalState, globalState); */}
      <br/>
      <br/>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
      <label style={{ marginBottom: '10px' }}>
        GitHub URL: <br/>
        <input type="url" value={url} onChange={e => setUrl(e.target.value)} required style={{ marginTop: '5px', width: "300px", padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
      </label>
      <button type="submit" style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007BFF', color: 'white', cursor: 'pointer' }}>
        Go to any Public Repository
      </button>
    </form>
      
      {/* <p>OR</p><br/>

     <button onClick={() => {localStorage.removeItem("accessToken");}}><a href=''>Log Out</a></button><br/> */}
      
      <p>New to this extension? Let's check out some FAQs</p>
    </>
  )
}

export default GithubWelcomePage