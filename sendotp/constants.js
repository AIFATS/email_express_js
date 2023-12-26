const axios = require("axios");
const { generateConfig } = require("../routes/utils");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const auth = {
  type: "OAuth2",
  user: "maheshd.mah@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "Mahesh <rozzabhishekmandal@gmail.com>",
  subject: "hii this is mahesh this is inform you that your friend is kidnapped ",
};

module.exports = {
  auth,
  mailoptions,
  oAuth2Client,
};