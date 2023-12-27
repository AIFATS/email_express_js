const { MongoClient } = require("mongodb");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { generateConfig } = require("../routes/utils");
const CONSTANTS = require("../sendotp/constants");

// Connect to MongoDB
const client = new MongoClient(
  "mongodb+srv://maheshdmah:Mahesh%40divya@cluster0.36cpwss.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function sendEmails() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("Marketing");
    const collection = database.collection("Emails");

    // Retrieve email data from the collection
    const emails = await collection.find().toArray();

    // Setup nodemailer transport
    const accessToken = await CONSTANTS.oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        ...CONSTANTS.auth,
        accessToken: accessToken,
      },
    });

    // Send emails with a 12-second delay between each email
    for (const emailData of emails) {
      let htmlContent = fs.readFileSync("./marketing/marketing.html", "utf-8");

      const mailOptions = {
        ...CONSTANTS.mailoptions,
        to: emailData.email,
        subject: `Great offer ${emailData.name}`,
        html: htmlContent, // Use html property instead of text
      };

      // Send the email
      const result = await transport.sendMail(mailOptions);
      console.log(`Email sent to ${emailData.email}:`, result);

      // Wait for 12 seconds before sending the next email
      await new Promise((resolve) => setTimeout(resolve, 12000));
    }

    console.log("All emails sent successfully");
  } catch (error) {
    console.error("Error sending emails:", error);
  } finally {
    // Disconnect from MongoDB
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

// Run the sendEmails function every minute
setInterval(sendEmails, 60000);