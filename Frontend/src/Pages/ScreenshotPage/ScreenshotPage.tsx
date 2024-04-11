import { Cropper, CropperRef } from 'react-advanced-cropper';
import { useEffect, useRef, useState } from 'react';
import './ScreenshotPage.css';
import 'react-advanced-cropper/dist/style.css';

const ScreenshotPage = () => {
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const cropperRef = useRef<CropperRef>(null);

  const onChange = (cropper: CropperRef) => {
    console.log(cropper.getCoordinates(), cropper.getCanvas());
  };

  const captureActiveWinImg = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, function (dataURL) {
        setCapturedImage(dataURL);
      });
    });
  };

  const cropImage = () => {
    const coordinates = cropperRef.current?.getCoordinates();
    if (coordinates) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = coordinates.width;
          canvas.height = coordinates.height;
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
          const croppedDataURL = canvas.toDataURL('image/png');
          setCroppedImage(croppedDataURL);
        }
      };
      img.src = capturedImage;
    }
  };

  const performOCR = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/performOCR', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: croppedImage }),
      });
      const data = await response.json();
      console.log(data);
      if(data.message=="success"){
        window.location.href = '#/explanation';
      }
    } catch (error) {
      console.error('Error performing OCR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    captureActiveWinImg();
  }, []);

  return (
    <>
      <h1 className='screenshot-h1'>Is this the area you want to select?</h1>
      <div className='new-container'>
        <button className='btn-snip' onClick={cropImage}>
          <a className='snip-a' href='#/screenshot'>
            Snip
          </a>
        </button>
        <button className='btn-confirm' onClick={performOCR} disabled={!croppedImage || loading}>
          {loading ? 'Loading...' : 'Confirm'}
        </button>
        <button className='btn-restart' onClick={captureActiveWinImg}>
          <a className='restart-a' href='#/screenshot'>
            Restart
          </a>
        </button>
      </div>
      <div className='cropper-container'>
        <Cropper ref={cropperRef} src={capturedImage} onChange={onChange} className={'cropper'} />
      </div>
      {croppedImage && <img src={croppedImage} className={'cropper'} id='cropped-img' alt='Cropped Image' />}
      <button className='btn-home'>
        <a href='' className='a-home'>
          Return Home
        </a>
      </button>
      <br />
      <p>New to this extension? Let's check out some <a href=''>FAQs</a></p>
    </>
  );
};

export default ScreenshotPage;
