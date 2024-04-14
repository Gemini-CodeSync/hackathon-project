import { useState, useEffect } from 'react';
import ReactSelect from 'react-select';
import { getAllRepos, getUserRepos, fetchRepoContents,  } from "../../utils/fetchCode";
import { useContext } from 'react';
import { GlobalStateContext } from "../../contexts/GlobalStateContext"


const GithubWelcomePage = () => {

  // const [rerender, setRerender] = useState(false);
  // const [repositories, setRepositories] = useState([]);
  // const [selectedRepo, setSelectedRepo] = useState(null);
  // const [selectedRepoContents, setSelectedRepoContents] = useState(null);
  const context = useContext(GlobalStateContext);

if (!context) {
  // context is null, handle the error
  throw new Error('GlobalStateContext is null');
}

const { globalState, setGlobalState } = context;

  const options = globalState.repositories 
  ? globalState.repositories.map((repo: any, index: number) => ({ value: repo.name, label: repo.name, id: index }))
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

  },[]);

  
  return (
    <>
      <h1>Hello, A</h1>
      <h1> Let's take advantage of premium features</h1>

      <button>Scan Now</button><br/>
      
      <p>Please choose one of the premium features</p><br/>
      <button onClick={getUserRepos}>Import Public Github Repositories</button><br/>
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
      
      
      
      {/* <p>OR</p><br/>

     <button onClick={() => {localStorage.removeItem("accessToken");}}><a href=''>Log Out</a></button><br/> */}
      
      <p>New to this extension? Let's check out some FAQs</p>
    </>
  )
}

export default GithubWelcomePage