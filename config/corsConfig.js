const API_URL = process.env.CLIENT_API_URL || process.env.PROD_API_URL;

const corsOptions = {
  origin: API_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = {
  corsOptions,
  API_URL,
};