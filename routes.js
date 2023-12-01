const express = require("express");
const controllers = require("./controllers");
const router = express.Router();

router.post("/mail/send", controllers.sendMail);

module.exports = router;
