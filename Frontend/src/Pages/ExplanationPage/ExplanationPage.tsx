import {  useEffect, useState } from 'react';
import './ExplanationPage.css'

const ExplanationPage = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    {type: 'bot', text: 'hi!'}
  ]);

  const handleSendQuestion = ()=>{
    if(userInput.trim() !== ''){
      setMessages([...messages, {type:'user', text: userInput}]);
      setUserInput('');
    }
  }

  useEffect(()=>{
    getData();
  });

  const getData = async()=>{
    const response = await fetch('http://localhost:3000/getDataResponse');
    const data = await response.json();

    console.log(data);
  }
  

  return (
    <>
      <h1 className='explanation-h1'>Let's get you the results!</h1>
      <p></p>
      <div className='results-box'>
        <div className='results-scroll'>
          {messages.map((message, index)=>(
            <div key={index} className={`chat-message ${message.type}-message`}>
              <p>{message.type==='user' ? 'You: ': 'Response: ' }{message.text}</p>
            </div>
          ))}
          </div>
        <div className='input-box'>
          <input type='text' placeholder='Ask your question...' value={userInput} onChange={(e)=>setUserInput(e.target.value)} />
        </div>
      </div>

      <button className='send-q-btn' onClick={handleSendQuestion}>Send Question</button>
      <button className='return-home'>Return Home</button>

      <p>New to this extension? Let's check out some <a href=''>FAQs</a></p>
    </>
  )
}

export default ExplanationPage