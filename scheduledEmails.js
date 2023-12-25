// scheduledEmails.js
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');
const { generateRandomNumber } = require('./utils');
const CONSTANTS = require('./constants');

async function sendScheduledEmails() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(CONSTANTS.mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    // Get emails from the Marketing collection
    const database = client.db('Marketing');
    const collection = database.collection('Emails');
    const emails = await collection.find().toArray();

    // Disconnect from MongoDB
    await client.close();

    // Iterate through emails and send them one by one
    for (const email of emails) {
      
      const accessToken = await CONSTANTS.oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          ...CONSTANTS.auth,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        ...CONSTANTS.mailoptions,
        to: email.recipient,
        subject: 'Scheduled Email',
        html: `This is a scheduled email. Random Number: `,
      };

      await transport.sendMail(mailOptions);
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  sendScheduledEmails,
};
