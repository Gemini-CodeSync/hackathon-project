//import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GlobalStateProvider } from './contexts/GlobalStateProvider'


ReactDOM.createRoot(document.getElementById('root')!).render(
 // <React.StrictMode> - rerenders app twice //only runs in dev environs
 <GlobalStateProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GlobalStateProvider>
 // </React.StrictMode>,
)

