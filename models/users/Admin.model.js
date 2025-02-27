const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
    //  isValidEmail
} = require("../../utils/helpers");

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters long"],
        set: (val) => val.charAt(0).toUpperCase() + val.slice(1).trim(),
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters long"],
        set: (val) => val.toUpperCase().trim(),
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        /*  validate: {
             validator: function (email) {
                 console.log("Validating email:", email);
                 return isValidEmail(email);
             },
             message: "Invalid email address",
         }, */
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin",
    },
}, {
    timestamps: true
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;