import { useLocation } from 'react-router';
import './PrivateRepoPage.css'
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';

const PrivateRepoPage = () => {
  const location = useLocation();
  const extractedUsername = location.state?.username;
  const extractedData = location.state?.extractedData || [];

  return (
    <>
      <h1 className='first-h1'>Hello, {extractedUsername}</h1>
      <h1 className="second-h1"> Let's take advantage of premium features</h1>

      <p className='home-p' style={{marginBottom:'0px'}}>Import from my private github repository:</p><br/>
      <img className='private-repo-gif' src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjZhZmlocjJjMWJxYWpxNG13cHByNnV6dnplYmdxZjd5aDVseng0MyZlcD12MV92aWRlb3Nfc2VhcmNoJmN0PXY/iZ8IgFBptly90tWuc8/200w.webp' alt='animated-gif'/><br/>

      <select>
      <option>Select your repo</option>
      {extractedData.map((repo: { htmlUrl: string | number | readonly string[] | undefined; fullName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
        <option key={index} value={repo.htmlUrl}>{repo.fullName}</option>
      ))}
    </select>

      <button style={{marginLeft:'29px', width:'35%', marginRight: '25px'}}><a href='#/chatPage' style={{color:'white'}}>Proceed</a></button>
      <button><a href="#/chatPage" style={{color:'white'}}>Return Home</a></button><br/>
      <p className="home-p">New to this extension? Let's check out some FAQs</p> 
    </>
  )
}

export default PrivateRepoPage