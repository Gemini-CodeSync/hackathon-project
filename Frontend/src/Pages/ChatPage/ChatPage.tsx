import { useLocation } from "react-router";

const ChatPage = () => {
  const location = useLocation();
  const extractedUsername = location.state?.username || '';
  return (
    <>
      <h1 className="first-h1">Hello, {extractedUsername}</h1>
      <h1 className="second-h1"> Let's take advantage of premium features</h1>

      <p className="home-p">Ask me any explanation for your repository code!</p><br/>
      {/* Insert an input box for question -- most likely textarea */}

      <button style={{marginLeft:'5%', marginRight: '10%'}}><a style={{color:'white'}}>Send Question</a></button>
      <button style={{width:'40%'}}><a href="" style={{color:'white'}}>Return Home</a></button><br/>

      <p className="home-p">New to this question? Let's check out some FAQs</p>
    </>
  )
}

export default ChatPage