// scheduledTask.js
const cron = require('node-cron');
const { sendScheduledEmails } = require('./scheduledEmails');
const mongoose = require('mongoose');
const { mongoURL } = require('./constants'); // Import the MongoDB connection string

// Connect to MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Schedule the task to run every minute
cron.schedule('*/1 * * * *', async () => {
  await sendScheduledEmails();
});
