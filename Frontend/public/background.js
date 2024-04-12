chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const codeParam = request.code;

  if (codeParam) {
    fetch(`https://github.com/login/oauth/access_token?client_id=b8a3e4fb31ad799aa9b7&client_secret=ee441a41e8a39d5a60a6413938e7b70cd94ac8af&code=${codeParam}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const accessToken = data.access_token;
      localStorage.setItem('accessToken', accessToken);
      // Now you can use the access token
    });
  }
});