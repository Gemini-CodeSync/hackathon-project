import { useState, ReactNode } from 'react';
import { GlobalStateContext } from "./GlobalStateContext"

type GlobalStateType = {
  rerender: boolean;
  repositories: any[];
  selectedRepo: any;
  selectedRepoContents: any[];
  publicRepos: any[];
  filePaths: any[];
  repoName: string;
  repoOwner: string;
  fileContents: any[];
};

type Props = {
  children: ReactNode;
};


export function GlobalStateProvider({ children }: Props) {

  const initialState: GlobalStateType = {
    rerender: false,
    repositories: [],
    selectedRepo: null,
    selectedRepoContents: [],
    publicRepos: [],
    filePaths: [],
    repoName: "",
    repoOwner: "",
    fileContents: [],
  };

  const [globalState, setGlobalState] = useState({});

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </GlobalStateContext.Provider>
  );
}