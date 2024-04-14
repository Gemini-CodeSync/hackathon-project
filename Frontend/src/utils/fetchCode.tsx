
export async function getAllRepos(setGlobalState: Function, globalState: any) {
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
        // setGlobalState({ ...globalState, repositories: data || [] });
        setGlobalState((prevState : any) => ({ ...prevState, repositories: data || [] }));
        //return data;
      })
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

  //Returns user data
  export async function getUserData() {
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
  export async function getUserRepos(setGlobalState: Function, globalState: any) {
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
        //return data;
        //setGlobalState({ ...globalState, publicRepos: data || [] });
        setGlobalState((prevState : any) => ({ ...prevState, publicRepos: data || [] }));
      })
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // export function viewRepo() {
  //   if (selectedRepo) {
  //     window.open(`https://github.com/${selectedRepo}`, '_blank');
  //   }
  // }
  

  export async function getRepoData(owner: any, repo: any) {
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

  export async function fetchDirContents(url: string) {
    const response = await fetch(url, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('accessToken')
      }
    });
    let data = await response.json();
    console.log('Data after fetchDirContents:', data)
    return data;
  }

  export async function fetchAllPaths(contents: any[]): Promise<string[]> {
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

  export async function fetchRepoContents(repo: any, repositories: any, setGlobalState: Function, globalState: any) {
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
    setGlobalState({...globalState, selectedRepoContents: paths});

  }
