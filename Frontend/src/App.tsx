import { useEffect, useState } from 'react';
import HomePage from './Pages/HomePage/HomePage';
import ScreenshotPage from './Pages/ScreenshotPage/ScreenshotPage';
import ExplanationPage from './Pages/ExplanationPage/ExplanationPage';
import GithubWelcomePage from './Pages/GithubWelcomePage/GithubWelcomePage';


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
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <>
      {route === '' && <HomePage />}
      {route === '#/screenshot' && <ScreenshotPage />}
      {route === '#/explanation' && <ExplanationPage />}
      {route === '#/github' && <GithubWelcomePage/>}
    </>
  );
};

export default App;

//Client ID: Iv1.0684b7eb45a8e6ae