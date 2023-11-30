require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: "maheshd.mah@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "Mahesh <maheshd.mah@gmail.com>",
  to: "maheshd.mah@gmail.com",
  subject: "Gmail API NodeJS",
};

module.exports = {
  auth,
  mailoptions,
};
