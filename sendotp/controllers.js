const fs = require("fs");
const { generateConfig } = require("../routes/utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("./constants");
const { MongoClient } = require("mongodb");

async function sendMail(req, res) {
  try {
    const { recipientEmail } = req.body;

    // Connect to MongoDB
    const client = new MongoClient("mongodb+srv://maheshdmah:Mahesh%40divya@cluster0.36cpwss.mongodb.net/LOGIN?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    // Generate a random number
    const randomNumber = generateRandomNumber();

    // Insert the random number into the MongoDB collection
    const database = client.db("LOGIN");
    const collection = database.collection("users");

    // Assuming you have a document with an email field in the users collection
    const filter = { email: recipientEmail };
    const update = { $set: { otp: randomNumber } };
    await collection.updateOne(filter, update);

    // Disconnect from MongoDB
    await client.close();

    // Send the email
    const accessToken = await CONSTANTS.oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        ...CONSTANTS.auth,
        accessToken: accessToken,
      },
    });

    let htmlContent = fs.readFileSync("./sendotp/Mail.html", "utf-8");
    htmlContent = htmlContent.replace("{{randomNumberPlaceholder}}", randomNumber);

    const mailOptions = {
      ...CONSTANTS.mailoptions,
      to: recipientEmail,
      html: htmlContent,
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