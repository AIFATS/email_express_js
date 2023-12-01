const express = require("express");
const cors = require("cors"); // Import the cors middleware
const routes = require("./routes");
require("dotenv").config();

const app = express();

app.use(cors()); // Enable CORS for all routes

app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});

app.use("/api", routes);

app.get("/", async (req, res) => {
  res.send("Welcome to Gmail API with NodeJS");
});
