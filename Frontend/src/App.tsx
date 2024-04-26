import { useEffect, useState } from 'react';
import HomePage from './Pages/HomePage/HomePage';
import ScreenshotPage from './Pages/ScreenshotPage/ScreenshotPage';
import ExplanationPage from './Pages/ExplanationPage/ExplanationPage';
import GithubWelcomePage from './Pages/GithubWelcomePage/GithubWelcomePage';
import PublicRepoPage from './Pages/PublicRepoPage/PublicRepoPage';
import PrivateRepoPage from './Pages/PrivateRepoPage/PrivateRepoPage';
import ChatPage from './Pages/ChatPage/ChatPage';

const App = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    // Initialize route state
    setRoute(window.location.hash);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); 

  return (
    <>
      {route === '' && <HomePage />}
      {route === '#/screenshot' && <ScreenshotPage />}
      {route === '#/explanation' && <ExplanationPage />}
      {route === '#/github' && <GithubWelcomePage/>}
      {route === "#/publicRepo" && <PublicRepoPage/>}
      {route === "#/privateRepo" && <PrivateRepoPage/>}
      {route === "#/chatPage" && <ChatPage/>}
    </>
  );
};

export default App;

