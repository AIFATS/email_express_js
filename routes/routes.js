const express = require("express");
const controllers = require("../sendotp/controllers");
const emailController = require("../marketing/emailController"); // Import the new email controller
const router = express.Router();

router.post("/mail/send", controllers.sendMail);

// Add a new route for sending emails from MongoDB collection
router.post("/mail/send-from-database", emailController.sendEmailsFromDatabase);


module.exports = router;