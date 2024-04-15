import './PublicRepoPage.css'

const PublicRepoPage = () => {

  return (
    <>
      <h1 className='second-h1'style={{marginTop:'8px', marginBottom:'4px'}}>Import from the vast world of open source :)</h1>

      <p className="home-p" style={{marginBottom:'0px'}}>Import from public github repository:</p><br/>
      <img className='gif-img' src='https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjVoc2lncG9zaWpjNWxybXo3a2Z1MWt1MWZucW83OWh2ZTlkd2gydiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BpGWitbFZflfSUYuZ9/200.webp' alt='animated-gif'></img><br/>

      <div className='input-box' style={{width:'85%', marginLeft: '10%', marginTop: '5px', marginBottom: "10px"}}>
        <input type="text" placeholder="Enter github link....." />
      </div>

      <button style={{marginLeft: '10%', marginRight: '8%', width:'32%'}}><a href='#/chatPage' style={{color:'white'}}>Proceed</a></button>
      <button><a href='#/github' style={{color:'white'}}>Return Home</a></button><br/>
      <p className="home-p">New to this extension? Let's check out some FAQs</p>
    </>
  )
}

export default PublicRepoPage