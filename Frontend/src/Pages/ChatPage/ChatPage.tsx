import { useState } from 'react';
import './ChatPage.css'

const ChatPage = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([{type: 'bot', text: 'Hi! Welcome to our extension. Feel free to ask questions.'}]);
  const [loading, setLoading] = useState(false);

  const getUserDataResponse = async () => {
    if (userInput.trim() !== '') {
      setMessages(prevMessages => [...prevMessages, { type: 'user', text: userInput }]);
      setUserInput('');
      try {
        setLoading(true);
        //change this response api with sending github access token, link 
        const response = await fetch('http://localhost:3000/getResponse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userInput }),
        });
        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, { type: 'bot', text: data.response }]);
      } catch (error) {
        console.log('Could not fetch data and returned error: ', error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
      <h1 className='explanation-h1'>Ask Your Questions</h1>
      <div className='results-box'>
        <div className='results-scroll'>
          {loading ? (
            <div className={`chat-message bot-message`}>
              <p>Loading...</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.type}-message`}>
                <p>{message.text}</p>
              </div>
            ))
          )}
        </div>
        <div className='input-box'>
          <input type='text' placeholder='Ask your question...' value={userInput} onChange={(e)=>setUserInput(e.target.value)} />
        </div>
      </div>

      <button className='send-q-btn' onClick={getUserDataResponse}>Send Question</button>
      <button className='return-home'><a href="#/github" style={{color:'white'}}>Return Home</a></button>

      <p className='home-p'>New to this extension? Let's check out some <a href=''>FAQs</a></p>
    </>
  )
}

export default ChatPage;
