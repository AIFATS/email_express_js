const express = require("express");
const controllers = require("../sendotp/controllers");
const emailController = require("../marketing/emailController"); // Import the new email controller
const couponController = require("../coupons/couponController");
const router = express.Router();

router.post("/mail/send", controllers.sendMail);

// Add a new route for sending emails from MongoDB collection
router.post("/mail/send-from-database", emailController.sendEmailsFromDatabase);

router.post("/mail/Coupon", couponController.sendEmailsFromDatabase);

module.exports = router;