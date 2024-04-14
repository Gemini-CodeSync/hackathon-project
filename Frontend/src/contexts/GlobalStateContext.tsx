import React from 'react';

type GlobalStateType = {
  globalState: any;
  setGlobalState: React.Dispatch<React.SetStateAction<any>>;
};

export const GlobalStateContext = React.createContext<GlobalStateType | null>(null);