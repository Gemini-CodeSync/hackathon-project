//add required libraries
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config()

//Import Generative AI library
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

//create instance of google generative AI using API key authentication
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_URI);

//Parse JSON data in request bodies 
app.use(bodyParser.json());

var responseToSend = '';

//Receive data sent to /performOCR and sent to Gemini model
app.post('/performOCR', (req, res) => {

  if(req.body)
  {
    console.log(req.body);
  }

  // get image data from request body
  const imageData = req.body.image;

  //replace unnecessary data to empty string in imageData
  const base64Data = imageData.replace(/^data:image\/png;base64,/, '');

  //decode base64Data from base64 to string data and store it in raw buffer as binaryData variable
  const binaryData = Buffer.from(base64Data, 'base64');

  //write binaryData (in binary format option) to image.png  
  fs.writeFile('image.png', binaryData, 'binary', async (err) => {
    if (err) {
      console.error('Error saving image:', err);
      
      //send error response if data was not written successfully
      return res.status(500).json({ error: 'Error saving image' });
    }

    console.log('Image saved successfully');
    res.json({ message: 'success' });
  });
});

app.get('/getDataResponse', async(req, res) => {

      //get gemini-pro-vision model gemini AI models
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const prompt= "Explain it to me like I'm 5. I have 0 knowledge of python so please tailor answer to my proficiency.Also explain some code concepts if possible"
    
      // send image data for suitable conversion
      const myImage = fileToGenerativePart("image.png", "image/png");
      const result = await model.generateContent([prompt, myImage]);
      const response = await result.response;
      const responseText = response.text();
      responseToSend = responseText;
      console.log(responseText);

  if (responseToSend  === '') {
    res.json({ response: 'no data to send, sorry!' });
    return;
  }

  console.log('Console log response:', responseToSend);
  res.json({ response: responseToSend });
});


app.post('/getUserResponse', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'No request body provided' });
    }

    // Get gemini-pro-vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = req.body.message ?? '';

    // Send image data for suitable conversion
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    console.log(responseText);

    if (!responseText) {
      res.json({ response: 'no data to send, sorry!' });
      return;
    }

    console.log('Console log response:', responseText);
    res.json({ response: responseText });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Error generating content' });
  }
});

//start listening on given port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// convert a file to a format suitable for the Generative AI API
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}


