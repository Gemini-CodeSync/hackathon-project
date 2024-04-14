import { useState, useEffect } from 'react';
import ReactSelect from 'react-select';

// import AceEditor from "react-ace";
// import { Treebeard } from 'react-treebeard';

// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-github";

// async function getRepositories() {
//   const accessToken = localStorage.getItem('accessToken');
//   const response = await fetch('https://api.github.com/user/repos', {
//     headers: {
//       'Authorization': `token ${accessToken}`
//     }
//   });
//   const data = await response.json();
//   return data;
// }

const GithubWelcomePage = () => {

  const [rerender, setRerender] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedRepoContents, setSelectedRepoContents] = useState(null);

  const options = repositories.map((repo: any, index: number) => ({ value: repo.name, label: repo.name, id: index }));

  //Returns all personal repositories, public and private
  async function getAllRepos() {
    try {
      return fetch(`http://localhost:3000/getAllRepos`, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('accessToken')
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Data after fetch:', data);
        //setRepositories(data);
        setRepositories(data || []);
        //return data;
      })
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

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
    getAllRepos();

  },[]);

  

  //Returns user data
  async function getUserData() {
    try {
      const response = await fetch('http://localhost:3000/getUserData', {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('accessToken')
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('UserData:', data)
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  //Returns only public repositories
  async function getUserRepos() {
    try {
      let data: any = await getUserData();
      console.log('Data after getUserData:', data);
      console.log('Data.login after getUserData:', data.login);
      return fetch(`http://localhost:3000/getUserRepos/${data.login}`, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('accessToken')
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Data after fetch:', data);
        return data;
      })
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function viewRepo() {
    if (selectedRepo) {
      window.open(`https://github.com/${selectedRepo}`, '_blank');
    }
  }
  

  async function getRepoData(owner: any, repo: any) {
    await fetch(`http://localhost:3000/getRepoData/${owner}/${repo}`, {
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

  async function fetchDirContents(url: string) {
    const response = await fetch(url, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('accessToken')
      }
    });
    let data = await response.json();
    console.log('Data after fetchDirContents:', data)
    return data;
  }

  async function fetchAllPaths(contents: any[]): Promise<string[]> {
    let paths: string[] = [];
    for (const item of contents) {
      paths.push(item.path);
      if (item.type === 'dir') {
        const dirContents = await fetchDirContents(item.url);
        paths = paths.concat(await fetchAllPaths(dirContents));
      }
    }
    console.log('Fetch all Paths:', paths)
    return paths;
  };

  async function fetchRepoContents(repo: any) {
    const repoObj: any = repositories[repo.id];
    console.log('repoObj:', repoObj);

  const contentsUrl = repoObj.contents_url.replace('{+path}', '');
  const response = await fetch(contentsUrl, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem('accessToken')
    }
  });
    const data = await response.json();
    console.log('Data after fetch: Repo Contents', data);
    const paths : any = await fetchAllPaths(data);
    console.log('Paths:', paths);
    setSelectedRepoContents(paths);

  }

  
  return (
    <>
      <h1>Hello, A</h1>
      <h1> Let's take advantage of premium features</h1>

      <button>Scan Now</button><br/>
      
      <p>Please choose one of the premium features</p><br/>
      <button onClick={getUserRepos}>Import Public Github Repositories</button><br/>
      <p>OR</p><br/>
      {/* <button onClick={getAccessibleRepos}>Import Private Github Repositories</button><br/> */}
      {repositories.length > 0 && (
        <ReactSelect
          options={options}
          isSearchable
          onChange={(selectedOption: any) => {
            setSelectedRepo(selectedOption);
          }}
        />
      )}
      <br/>
      <button onClick={() => {fetchRepoContents(selectedRepo)}}>Import Private Github Repository</button><br/>
      
      
      
      {/* <p>OR</p><br/>

     <button onClick={() => {localStorage.removeItem("accessToken");}}><a href=''>Log Out</a></button><br/> */}
      
      <p>New to this extension? Let's check out some FAQs</p>
    </>
  )
}

export default GithubWelcomePage