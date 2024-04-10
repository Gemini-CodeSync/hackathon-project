import './ExplanationPage.css'

const ExplanationPage = () => {
  return (
    <>
      <h1 className='explanation-h1'>Let's get you the results!</h1>

      <div className='results-box'>
        <div className='results-scroll'>
          <div className='chat-message user-message'>
            <p>User: What is the capital of France?</p>
          </div>
          <div className='chat-message bot-message'>
            <p>Response: The capital of France is Paris.</p>
          </div>
          <div className='chat-message user-message'>
            <p>User: Who is the president of the United States?</p>
          </div>
          <div className='chat-message bot-message'>
            <p>Response: The president of the United States is Joe Biden.</p>
          </div>
        </div>
        <div className='input-box'>
          <input type='text' placeholder='Ask your question...' />
        </div>
      </div>



      <button className='send-q-btn'>Send Question</button>
      <button className='return-home'>Return Home</button>

      <p>New to this extension? Let's check out some <a href=''>FAQs</a></p>
    </>
  )
}

export default ExplanationPage