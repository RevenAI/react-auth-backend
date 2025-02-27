const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const comparePassword = async (enteredPassword, storedHashedPassword) => {
    return await bcrypt.compare(enteredPassword, storedHashedPassword);
};

const isValidEmail = (email) => {
    if (!email || typeof email !== "string") return false;
    //const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email.trim());
};

const generateAccessToken = (userID) => {
    return jwt.sign({
            userID
        },
        process.env.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
        }
    );
};

const generateRefreshToken = (userID) => {
    return jwt.sign({
            userID
        },
        process.env.JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
        }
    );
};

const verifyToken = (TOKEN, SECRET_KEY) => {
    if (!TOKEN || !SECRET_KEY) return null;
    try {
        return jwt.verify(TOKEN, SECRET_KEY);
    } catch (err) {
        return null;
    }
};

module.exports = {
    hashPassword,
    comparePassword,
    isValidEmail,
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
};