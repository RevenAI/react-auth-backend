require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const corsOptions = require("../config/corsConfig");
const allowedOrigins = require("../config/allowedOrigins"); 
const corsCredentials = require("../middlewares/corsCredentials");

const adminRouter = require("../routes/users/Admin.router");

const app = express();

// Security Middleware 
app.use(helmet());

// Handle CORS Credentials (Handles Access-Control-Allow-Origin, etc.)
app.use(corsCredentials);

// CORS Configuration 
app.use(cors(corsOptions));

// Essential Middlewares
app.use(cookieParser());  // Parses cookies
app.use(express.json());  // Parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Performance Middleware
app.use(compression()); // Compresses response bodies
app.use(morgan("dev")); // Logs requests

// Routes
app.use("/admins", adminRouter);

module.exports = app;
