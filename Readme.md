### Gmail Autoreplier

Send automatic replies to people who email you by using google-apis

Github: https://github.com/Ankur-Datta-4/gAutoReply
Demo: https://www.loom.com/share/8dacc791243b4d90b0133b31e668a289

### How to use:

1. copy structure of .env from .env.example
2. replace the .env file path in src/index.js
3. Get OauthClientID and keys for web-application with gmail scope and put it in .env file
4. 🚀 Now you are good to go! execute
   `node src/index.js`

### Desc:

1. Replies to isolated emails with I'm on a vacation message
2. Categorizes message as "Snoozed" (New label if label=snoozed is absent)

### Reference Steps:

1. index/login: Gets access token from services/getAccessToken. Further, invokes checkEmails with random periodicity between 45s-120s
2. index/checkEmails: Lists emails. If the email is unread and isolated from threads, sends a reply email. Further, categorizes as label name mentioned.
   -> We also remove label UNREAD to make sure we don't send double replies
