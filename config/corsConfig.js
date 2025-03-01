const allowedOrigins = require('./allowedOrigins');

const allowDevTools = (origin) => {
  return process.env.NODE_ENV === "development" && !origin;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || allowDevTools(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;