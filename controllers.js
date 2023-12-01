const fs = require("fs");

const { generateConfig } = require("./utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("./constants");

async function sendMail(req, res) {
  try {
    const { recipientEmail } = req.body;

    const accessToken = await CONSTANTS.oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        ...CONSTANTS.auth,
        accessToken: accessToken,
      },
    });

    let htmlContent = fs.readFileSync("Mail.html", "utf-8");
    const randomNumber = generateRandomNumber();
    htmlContent = htmlContent.replace("{{randomNumberPlaceholder}}", randomNumber);

    const mailOptions = {
      ...CONSTANTS.mailoptions,

      to: recipientEmail,

      html: htmlContent, // Set the HTML content here

    };

    const result = await transport.sendMail(mailOptions);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

function generateRandomNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

module.exports = {
  sendMail,
};
