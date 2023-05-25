require("dotenv").config({
  path: `C:\\Users\\ankur\\OneDrive\\Desktop\\gAutoReplyOpenInApp\\.env`,
});
const { google } = require("googleapis");
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
const readline = require("readline");
const makeBody = require("./services/makeBody");

const gmail = google.gmail({ version: "v1", auth: oauth2Client });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function checkEmails() {
  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      q: "is:unread -in:chats -from:me from:ankurr2002@outlook.com",
    });

    const messages = response.data.messages || [];
    for (const message of messages) {
      const msgResponse = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      const threadId = msgResponse.data.threadId;
      const history = msgResponse.data.history || [];
      const sentByMe = history.some((entry) => entry.labelIds.includes("SENT"));
      if (!sentByMe) {
        // find sender email from msgResponse
        const headers = msgResponse.data.payload.headers;
        const fromHeader = headers.find((header) => header.name === "From");
        const fromEmail = fromHeader.value;
        const messageBody = "Hey there, I am on a vacation!";
        // Reply to the email
        const rawMessage = makeBody({
          to: fromEmail,
          from: "me",
          message: messageBody,
          subject: "Re: Out of office",
        });
        await gmail.users.messages.send({
          userId: "me",
          resource: {
            raw: rawMessage,
            threadId: threadId,
          },
        });
        console.log("Sent email reply!");
        console.log("Checking for label...");

        // Add label to the email
        const labelName = "snoozedx";
        const labelResponse = await gmail.users.labels.list({
          userId: "me",
        });
        const labels = labelResponse.data.labels || [];
        let label = labels.find((label) => label.name === labelName);
        if (!label) {
          const createLabelResponse = await gmail.users.labels.create({
            userId: "me",
            resource: {
              name: labelName,
              labelListVisibility: "labelShow",
              messageListVisibility: "show",
            },
          });

          console.log("Created label:", createLabelResponse.data);
          label = createLabelResponse.data;
        }
        // marking the mail as read
        await gmail.users.messages.modify({
          userId: "me",
          id: message.id,
          resource: {
            removeLabelIds: ["UNREAD"],
          },
        });

        // Add the label to the email
        await gmail.users.messages.modify({
          userId: "me",
          id: message.id,
          resource: {
            addLabelIds: [label.id],
          },
        });
      }
    }
  } catch (error) {
    console.error("Error checking emails:", error);
  }
}

async function login() {
  try {
    // const tokens = await getAccessToken();
    // console.log("Access token:", tokens.access_token);
    // console.log("Refresh token:", tokens.refresh_token);

    // Use the access token to authenticate further API requests

    let tempAccess =
      "ya29.a0AWY7CkkszfHkgzjBHLuHtSAMPpSUFaZig0bgx8ft4QHaGqOkl2_Rz4_-1Rc9ELX7ZhgVDOLZ_HqUyEQyhooGZw2gdLhaX2D139sAyQtJj4yhc1ynXGP0gow6mwKhtU0AUC1FsFBgfsGltzLZKBJfR2UdiigHaCgYKAfsSARESFQG1tDrpWjkEzRUeNcCOYLodS9IJjg0163";
    let tempRefresh =
      "1//0gbq32g7_l-yeCgYIARAAGBASNwF-L9IrKv1SMgyJcz2nuIZLkIcCDHwVP5Il3UPbpugPQ47R5qmNidSzzhP3P-ThwpLskeLFJpI";
    console.log("Access token:", tempAccess);
    console.log("Refresh token:", tempRefresh);
    oauth2Client.setCredentials({
      access_token: tempAccess,
      refresh_token: tempRefresh,
    });
    // Call the function at random intervals
    setInterval(checkEmails, 10000);
  } catch (error) {
    console.error("Login error:", error);
  }
}

// Call the login function to start the login flow
login();
