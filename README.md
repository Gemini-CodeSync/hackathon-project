## Gemini CodeSync

### Google Gemini 2024 Hackathon

Gemini CodeSync is a Chrome extension that provides real-time, personalized code explanations. Whether you're a beginner or a seasoned pro, our AI/ML powered tool enhances learning and boosts productivity.

It utilizes a variety of APIs, Google Gemini and JS Frameworks along with integration with GitHub for you to be able to get code explained to you with the ability to utilize private and public GitHub Repository's to allow for ease of access.

**APIs Utilized:**

- Langchain
- Chrome API
- GitHub Authentication API
- langchain_community
- unstructured # Document loading
- chromadb # Vector storage
- langchain-google-genai # For embeddings
- langchain_core
- google-generativeai
- python-dotenv
- langchain-text-splitters
- chromadb

**Tech Stack Used:** 

- Python
- Flask
- TypeScript + Vite
- Github Oauth Apps

**Requirements:**

- A Github Account with API Access
- Google Chrome or Chromium-based Web Browser
- Internet Connection
- Available Repository

<br />

**Video Demo:**

![final gif](https://github.com/Gemini-CodeSync/hackathon-project/assets/44122973/b463979c-0621-463b-84c0-4fb47718b889)


More on: [https://www.youtube.com/@GeminiCodeSync](https://youtu.be/5r4tGGZfIOE)
<br /><br />

**Project Link:**

https://devpost.com/software/gemini-codesync
<br /><br />

## Setting up chrome extension on your machine:

1. Pull the code from the github repo using this link:

**For Frontend:**

2. Run this command:

```bash
cd Frontend
npm run build
```

3. Once this command is successful, please go to manage extensions on chrome and then click load unpacked and head over to the `dist` folder and select that. This should load your extension on the Chrome manage extensions page.

4. You'll require to set up GitHub OAuth app authentication. Click GitHub account settings > Developer settings > OAuth Apps.

5. Now click "New OAuth App" and create an application with:

   - **Application name:** (any name you would like)
   - **Homepage URL:** `https://<Chrome Extension ID>.chromiumapp.org/` (for example: `https://mhihlgdjfhfmocmbdbjgadkmmkeihepe.chromiumapp.org/`)
   - **Callback URL:** `https://<Chrome Extension ID>.chromiumapp.org/github`

   **Note:** To find your Chrome extension ID, head over to your "My Extensions" page under "Manage Chrome Extensions" on your Google browser. Only the Gemini CodeSync 1.0.0 extension should be listed. You'll see the ID: `kefwheuigiuleriughuierhg`. Use this ID when configuring the GitHub OAuth app.

6. Once this is successful, please create a secret client.

7. Create a `.env` file under `Frontend` with these configurations:
   - **VITE_APP_CLIENT_ID=** `Your Client ID from oauth app`
   - **VITE_APP_CLIENT_SECRET=** `Your Client Secret from oauth app`
   - **VITE_APP_REDIRECT_URI=** `https://<Chrome Extension ID>.chromiumapp.org/#/github`

**For Backend:**

1. Run this command:

```bash
cd Backend
```

2. Create a `.env` file:

   - **GOOGLE_API_KEY=** `Your Google Gemini API key here`
   - **CLIENT_ID=** `Your Client ID from oauth app`
   - **CLIENT_SECRET=** `Your Client Secret from oauth app`

3. Run this command:

```bash
python3 -m venv .venv
```

**Note:** Make sure you have Python installed on your machine before running this command or any `pip` commands.

4. For Windows, use this command to activate your virtual environment:

```bash
.venv\Scripts\activate
```

**For other operating systems, please refer to Flask documentation.**

5. Now run:

```bash
pip install -r requirements.txt
```

This should install all the required dependencies on your machine to run Python.

6. With this, you should now have everything required to run the app using:

```bash
python app.py
```

**Congratulations, if you have made it to this far! The extension has been successfully set up!**

If any changes have been made on the frontend, please ensure that you are running `npm run build` and updating the extension by clicking "Update" through "Manage Extensions" to see those changes.
