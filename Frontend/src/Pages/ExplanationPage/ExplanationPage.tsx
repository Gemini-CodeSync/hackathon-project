import {  useEffect, useState } from 'react';
import './ExplanationPage.css'

const ExplanationPage = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([{type: 'bot', text: 'hi!'}]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    getData();
  },[]);

  const getData = async()=>{
    try{
      console.log('hi');
      setLoading(true);
      const response = await fetch('http://localhost:3000/getDataResponse');
      if(response.ok)
        {
          const data = await response.json();
          console.log(data);
          setMessages([{type:'bot', text:data.response}])
        }
    }catch(error){
      console.log('Could not fetch data and returned error: ', error);
    }finally{
      setLoading(false);
    }
  }
  
  const getUserDataResponse = async() =>{

    if(userInput.trim() !== ''){
      setMessages(prevMessages => [...prevMessages, { type: 'user', text: userInput }]);
      setUserInput('');
    }

    try{
      setLoading(true);
      const response = await fetch('http://localhost:3000/getUserResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      console.log(data);
      setMessages(prevMessages => [...prevMessages, { type: 'bot', text: data.response }]);
        
    }catch(error){
      console.log('Could not fetch data and returned error: ', error);
    }finally{
      setLoading(false);
    }
  }


  return (
    <>
      <h1 className='explanation-h1'>Let's get you the results!</h1>
      <p></p>
      <div className='results-box'>
        <div className='results-scroll'>
          {loading ? ( // If loading, display "Loading..." message
              <div className={`chat-message bot-message`}>
                <p>Loading...</p>
              </div>
            ) : ( // If not loading, render messages
              messages.map((message, index) => (
                <div key={index} className={`chat-message ${message.type}-message`}>
                  <p>{message.text}</p>
                  {/* {message.type === 'user' ? 'You: ' : 'Response: '} */}
                </div>
              ))
            )}
          </div>
        <div className='input-box'>
          <input type='text' placeholder='Ask your question...' value={userInput} onChange={(e)=>setUserInput(e.target.value)} />
        </div>
      </div>

      <button className='send-q-btn' onClick={getUserDataResponse}>Send Question</button>
      <button className='return-home'><a href=''>Return Home</a></button>

      <p>New to this extension? Let's check out some <a href=''>FAQs</a></p>
    </>
  )
}

export default ExplanationPage