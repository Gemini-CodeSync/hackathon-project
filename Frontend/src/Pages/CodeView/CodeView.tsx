import { useState } from 'react';
import { Buffer } from 'buffer';
import { useContext } from 'react';
import { GlobalStateContext } from "../../contexts/GlobalStateContext"



function MyComponent() {
    const context = useContext(GlobalStateContext);

    if (!context) {
      // context is null, handle the error
      throw new Error('GlobalStateContext is null');
    }
    
    const { globalState, setGlobalState } = context;
    const [fileContents, setFileContents] = useState<string[]>([]);

    globalState.selectedRepoContents.forEach((filePath: any) => {
    fetch(`https://api.github.com/repos/${globalState.repoOwner}/${globalState.repoName}/contents/${filePath}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('accessToken')
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const fileContentBase64 = data.content;
        const fileContent = Buffer.from(fileContentBase64, 'base64').toString('utf8');

        setFileContents((prevFileContents) => [...prevFileContents, `File: ${filePath}\n${fileContent}\n\n`]);
      })
      .catch((error) => {
        console.error(`Failed to get file content for ${filePath}: ${error}`);
      });
  });

  return (
    <div>
      {fileContents.map((fileContent, index) => (
        <pre key={index}>{fileContent}</pre>
      ))}
    </div>
  );
}

export default MyComponent;