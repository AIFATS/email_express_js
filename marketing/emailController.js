const sendEmails = require("./sendEmails"); // Import the script that sends emails

async function sendEmailsFromDatabase(req, res) {
  try {
    // Call the function that sends emails from the MongoDB collection
    await sendEmails();

    // Respond with a success message
    res.status(200).send("Emails from database sent successfully");
  } catch (error) {
    console.error("Error sending emails from database:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  sendEmailsFromDatabase,
};
