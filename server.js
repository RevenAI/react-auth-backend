const app = require("./app/app");
const dbConnect = require("./config/dbConnect");
const PORT = process.env.PORT || 4000;

dbConnect().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => console.error("Failed to start server due to DB error:", err));