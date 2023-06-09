/*
    param: Initialized oauth2Client object
    return: Promise object that resolves to the access token
    description: Generates a link for logging into google. After authorization, resolves to token values
*/
const express = require("express");
const app = express();
function getAccessToken(oauth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify",
      ],
    });

    app.get("/oauthcallback", (req, res) => {
      const code = req.query.code;
      oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
          reject(err);
          res.send("Couldn't authorize");
        } else {
          oauth2Client.setCredentials(tokens);
          resolve(tokens);
          res.send("Authorized");
        }
      });
    });
    app.listen(4532);
    console.log(`Please authorize the app by visiting this URL: ${authUrl}`);
  });
}

module.exports = getAccessToken;
