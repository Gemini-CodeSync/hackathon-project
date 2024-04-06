import { Cropper, CropperRef } from 'react-advanced-cropper';
import { useRef, useState } from 'react';
import './App.css'
import 'react-advanced-cropper/dist/style.css'

const App= ()=> { 
  const [capturedImage, setCapturedImage] = useState<string>(''); 
  const [croppedImage, setCroppedImage] = useState<string>('');
  const cropperRef = useRef<CropperRef>(null);

  const onChange = (cropper: CropperRef)=>{
    console.log(cropper.getCoordinates(), cropper.getCanvas());
  }
 
  //parse through cropper Ref coordinates and set to croppedImage
  const cropImage = ()=>{
    //get current cropperRef coordinates
    const coordinates = cropperRef.current?.getCoordinates();

    if(coordinates)
    {
      console.log(coordinates);
       
      //create new Image element
      const img = new Image();

      //once the image has finished loading, proceed
      img.onload = () =>{
        //create canvas and get canvas context in 2d
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if(ctx)
        {
          //set canvas dimensions to cropped area
          canvas.width = coordinates.width;
          canvas.height= coordinates.height;

          //draw cropped portion of image on canvas
          ctx.drawImage(
            img,
            coordinates.left,
            coordinates.top,
            coordinates.width,
            coordinates.height,
            0,
            0,
            coordinates.width,
            coordinates.height
          );

          //create a data URL of the cropped image
          const croppedDataURL = canvas.toDataURL('image/png');

          //update cropped image state
          setCroppedImage(croppedDataURL);
        }
      };

      //load the captured image into img object
      img.src = capturedImage;
      
    }}

    const performOCR = async () => {
      try {
        //send a post request to OCR endpoint
        const response = await fetch('http://localhost:3000/performOCR', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: croppedImage }),   //convert croppedImage to JSON as a string
        });

        //parse response as JSON
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error performing OCR:', error);
      }
    }

  //capture screenshot of active window and set it to capturedImage
  const captureActiveWinImg= ()=>{
    //get currently active tabs in the current window
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tab = tabs[0];

        //capture screenshot of the current active tab at index 0 (basically the current tab you are on)
        chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, function(dataURL) {
          setCapturedImage(dataURL);
        });
      });
    }

  return (
    <>
      <button onClick={captureActiveWinImg} className="button">Start Scan</button> 
      <button onClick={cropImage}>Crop</button>
      {/* Have two buttons -confirm and scan again after showing cropped image */}
      <button onClick={performOCR}>OK</button>
      <button onClick={captureActiveWinImg}>Scan again</button>
      <div className="cropper-container">
        {/* show image cropper */}
        <Cropper
          ref={cropperRef}
          src={capturedImage}
          onChange={onChange}
          className={'cropper'}
        />
      </div>
      {/* if croppedImage exists, show in the UI */}
      {croppedImage && <img src={croppedImage} className={'cropper'}  alt="Cropped Image" />}
      <p>OCR Result</p>
      {/* {ResultedOCR && <p>OCR Result: {ResultedOCR}</p>} */}
    </>
  )
}

export default App
