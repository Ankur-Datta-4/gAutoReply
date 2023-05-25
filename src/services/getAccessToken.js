/*
    param: Initialized oauth2Client object
    return: Promise object that resolves to the access token
    description: Generates a link for logging into google. After authorization, resolves to token values
*/
function getAccessToken(oauth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify",
      ],
    });

    console.log(`Please authorize the app by visiting this URL: ${authUrl}`);
    rl.question("Enter the authorization code: ", (code) => {
      rl.close();

      oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
          reject(err);
        } else {
          oauth2Client.setCredentials(tokens);
          resolve(tokens);
        }
      });
    });
  });
}
