import './ScreenshotPage.css'

const ScreenshotPage = () => {
  return (
    <>
        <h1 className='screenshot-h1'>Is this the area you want to select?</h1>

        <div className='new-container'>
          <button className='btn-snip'><a className='snip-a' href='#/explanation'>Snip</a></button>
          <button className="btn-confirm"><a className='confirm-a' href='#/explanation'>Confirm</a></button>
          <button className="btn-restart"><a className='restart-a' href='#/explanation'>Restart</a></button>
        </div>

        <img className='original-img' src='https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg' alt='cropped image'/><br/>

        <button className='btn-home'><a href='' className='a-home'>Return Home</a></button><br/>
        <p>New to this extension? Let's check out some <a href=''>FAQs</a></p>
    </>
  )
}

export default ScreenshotPage