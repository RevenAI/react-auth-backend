const allowedOrigins = [
    process.env.CLIENT_API_URL,
    process.env.CLIENT_API_URL1,
    process.env.CLIENT_API_URL2,
    process.env.PROD_API_URL
].filter(Boolean);

module.exports = allowedOrigins;