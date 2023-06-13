/*
    Params:{subject:string, message:string, to:string, from:string}
    Return: base64 encoded string
    Description: This function returns the body expected by the gmail api as raw contents
*/
const makeBody = (params) => {
  params.subject = new Buffer.from(params.subject).toString("base64");
  let str = "";
  if (params.inReplyTo) {
    str = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      "MINE-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      `to: ${params.to} \n`,
      `from: ${params.from} \n`,
      `In-Reply-To: ${params.inReplyTo} \n`,
      `subject: =?UTF-8?B?${params.subject}?= \n\n`,
      params.message,
    ].join("");
  } else {
    str = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      "MINE-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      `to: ${params.to} \n`,
      `from: ${params.from} \n`,
      `subject: =?UTF-8?B?${params.subject}?= \n\n`,
      params.message,
    ].join("");
  }

  return new Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

module.exports = makeBody;
