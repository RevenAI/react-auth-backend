const {
    verifyToken
} = require("../utils/helpers");

const authUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return res.status(403).json({
            statusCode: 403,
            status: "Unauthorized",
            message: "Access token missing or invalid",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const verified = verifyToken(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        if (!verified) {
            return res.status(403).json({
                statusCode: 403,
                status: "Unauthorized",
                message: "Access token missing or invalid",
            });
        }

        req.user = verified;
        next();

    } catch (err) {
        return res.status(401).json({
            statusCode: 401,
            status: "Unauthorized",
            message: "Invalid or expired token",
        });
    }
};

module.exports = authUser;