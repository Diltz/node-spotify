async function getAccessToken(clientId: string, clientSecret: string) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });
  
    const data = await response.json();
    console.log(data)
    return data.access_token;
  };
  
(async () => {
    console.log(await getAccessToken('42579b56482b4e99b4c98c169a704e75', 'c190b0220a46460abc60f83107ef9802'))
})()