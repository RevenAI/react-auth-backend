require('dotenv').config();
const mongoose = require('mongoose');
const dbURI = process.env.DB_URI;

const getTimestamp = () => new Date().toISOString();
const separator = '................................';

const dbConnect = async () => {
  try {
    await mongoose.connect(dbURI);
    const successMessage = `\n${separator}\n[${getTimestamp()}] Connection to MongoDB was successful\n${separator}\n`;
    console.log(successMessage);
  } catch (err) {
    const errorMessage = `\n${separator}\n[${getTimestamp()}] Error connecting to MongoDB: ${err.message}\n${separator}\n`;
    console.error(errorMessage);
    process.exit(1);
  }

  // MongoDB connection events
  mongoose.connection.on('error', (err) => {
    const errorMessage = `\n${separator}\n[${getTimestamp()}] MongoDB connection error: ${err.message}\n${separator}\n`;
    console.error(errorMessage);
  });

  mongoose.connection.on('disconnected', () => {
    const disconnectionMessage = `[${getTimestamp()}] MongoDB connection was lost.`;
    console.warn(disconnectionMessage);
  });

  mongoose.connection.on('reconnected', () => {
    const reconnectionMessage = `[${getTimestamp()}] Reconnected to MongoDB.`;
    console.log(reconnectionMessage);
  });

  mongoose.connection.on('connected', () => {
    const connectedMessage = `\n${separator}\n[${getTimestamp()}] MongoDB connection established successfully.\n${separator}\n`;
    console.log(connectedMessage);
  });
};

module.exports = dbConnect;