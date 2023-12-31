const { MongoClient } = require("mongodb");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { generateConfig } = require("../routes/utils");
const CONSTANTS = require("../sendotp/constants");

async function sendEmails() {
  let client; // Define the client variable in the outer scope

  try {
    // Connect to MongoDB
    client = new MongoClient(
      "mongodb+srv://maheshdmah:Mahesh%40divya@cluster0.36cpwss.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("Marketing");
    const collection = database.collection("Emails");

    // Retrieve email data from the collection
    const emails = await collection.find().toArray();

    for (const emailData of emails) {
      // Check if the email should be sent based on the nextScheduledTime
      const nextScheduledTime = emailData.nextScheduledTime
        ? new Date(emailData.nextScheduledTime)
        : new Date();

      const currentTimeIST = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });

      if (nextScheduledTime > new Date(currentTimeIST)) {
        console.log(`Email for ${emailData.email} is scheduled for later. Skipping.`);
        continue;
      }

      if (!emailData.lastSentTimes) {
        emailData.lastSentTimes = [];
      }

      const lastSentTimes = emailData.lastSentTimes;

      if (lastSentTimes.length >= 10) {
        // If there are already 10 entries, remove the oldest entry
        lastSentTimes.shift();
      }

      // Add the current timestamp to the array
      lastSentTimes.push(currentTimeIST);

      // Sort the array in ascending order
      lastSentTimes.sort();

      let htmlContent = fs.readFileSync("./marketing/marketing.html", "utf-8");

      const mailOptions = {
        ...CONSTANTS.mailoptions,
        to: emailData.email,
        subject: `Great offer ${emailData.name}`,
        html: htmlContent,
      };

      // Setup nodemailer transport
      const accessToken = await CONSTANTS.oAuth2Client.getAccessToken();
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          ...CONSTANTS.auth,
          accessToken: accessToken,
        },
      });

      // Send the email
      const result = await transport.sendMail(mailOptions);
      console.log(`Email sent to ${emailData.email}:`, result);

      // Schedule the next email to be sent after 30 seconds
      const nextScheduledTimeUTC = new Date();
      nextScheduledTimeUTC.setSeconds(nextScheduledTimeUTC.getSeconds() + 0);

      // Update the nextScheduledTime in the database for this email
      await collection.updateOne(
        { _id: emailData._id },
        {
          $set: {
            lastSentTimes: lastSentTimes,
            nextScheduledTime: nextScheduledTimeUTC.toISOString(),
          },
        }
      );

      console.log(`Next email for ${emailData.email} scheduled for ${nextScheduledTimeUTC}`);
    }

    console.log("All emails sent successfully");
  } catch (error) {
    console.error("Error sending emails:", error);
  } finally {
    // Disconnect from MongoDB
    if (client) {
      await client.close();
      console.log("Disconnected from MongoDB");
    }
  }
}

// Run the sendEmails function immediately
sendEmails();

// Run the sendEmails function every 30 seconds
setInterval(sendEmails, 30000);
