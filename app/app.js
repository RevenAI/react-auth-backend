require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const corsOptions = require("../config/corsConfig");
const adminRouter = require("../routes/users/Admin.router");
const app = express();
cookieParser = require("cookie-parser");

app.use(cookieParser());

//cors configuration
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// Routes
app.use("/admins", adminRouter);

module.exports = app;