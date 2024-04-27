import { useEffect, useState } from 'react';
import './ChatPage.css'

const ChatPage = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([{type: 'model', text: 'Hi! Welcome to our extension. Feel free to ask questions.'}]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string; }[]>([]);
    

  useEffect(()=>{
    chrome.storage.local.get("username", async function(result){
      if(result.username){
        console.log("Username:", result.username);
        setUsername(result.username);
        const response = fetch('http://localhost:3000/startChat', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'username': username
          }
        });
        console.log((await response).json())
      }
    })
  }, []);

  const getUserDataResponse = async () => {
    if (userInput.trim() !== '') {
      setMessages(prevMessages => [...prevMessages, { type: 'user', text: userInput }]);
      setChatHistory(prevHistory => [...prevHistory, { role: 'user', text: userInput }]);
      setUserInput('');
      try {
        setLoading(true); 
        const response = await fetch('http://localhost:3000/sendMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userTextQuery: userInput, username: username, chatHistory: chatHistory}),
        });
        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, { type: 'model', text: data.response }]);
        setChatHistory(prevHistory => [...prevHistory, { role: 'model', text: data.response }]);
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
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.type}-message`}>
               <div>{message.text}</div>
            </div>
          ))}
          {loading && (
            <div className='chat-message bot-message'>
              <p>Loading...</p>
            </div>
          )}
        </div>
        <div className='input-box'>
          <input type='text' placeholder='Ask your question...' value={userInput} onChange={(e) => setUserInput(e.target.value)} />
        </div>
      </div>

      <button className='send-q-btn' onClick={getUserDataResponse}>Send Question</button>
      <button className='return-home'><a href="#/github" style={{ color: 'white' }}>Return Home</a></button>

      <p className='home-p'>New to this extension? Let's check out some <a href=''>FAQs</a></p>
    </>
  )
}

export default ChatPage;
