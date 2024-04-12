//add required libraries
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var cors = require('cors');
const fetch = (...args) => 
  import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()

//Import Generative AI library
const { GoogleGenerativeAI } = require("@google/generative-ai");

const CLIENT_ID = "b8a3e4fb31ad799aa9b7";
const CLIENT_SECRET = "ee441a41e8a39d5a60a6413938e7b70cd94ac8af";

const app = express();
const port = process.env.PORT || 3000;

//create instance of google generative AI using API key authentication
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_URI);

//Parse JSON data in request bodies 
app.use(bodyParser.json());
app.use(cors());

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

app.get('/getAccessToken', async function (req, res) {
  console.log(req.query.code);
  const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;

  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    }})
    .then(response => {return response.json()})
    .then(data => {
      console.log(data, "Access data");
      res.json(data);
    })

});

app.get('/getUserData', async function (req,res) {
  req.get('Authorization'); //Bearer ACCESS_TOKEN
  await fetch("https://api.github.com/user", {
    method: 'GET',
    headers: {
      'Authorization': req.get('Authorization'),
    }})
    .then(response => {return response.json()})
    .then(data => {
      console.log(data);
      res.json(data);
    })
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


