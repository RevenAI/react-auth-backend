const {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    // isValidEmail
} = require('../../utils/helpers');
const Admin = require('../../models/users/Admin.model');

/**
 * @desc    create/register admin
 * @route   POST /admins
 * @access  Private (Master Admin Only)
 */
exports.registerAdmin = async (req, res) => {

    const {
        userID: authID
    } = req.user;

    if (!authID) {
        return res.status(403).json({
            statusCode: 403,
            status: 'Unathorized',
            message: 'You are not authorized to perform this action'
        });
    }

    try {
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                statusCode: 400,
                status: 'Bad Request',
                message: 'All fields are required'
            });
        }

        /*     const validatedEmail = isValidEmail(email.toLowerCase().trim());
            if (!validatedEmail) {
                return res.status(400).json({
                    statusCode: 400,
                    status: 'Bad Request',
                    message: 'Invalid email address'
                });
            } */

        const validatedEmail = email.toLowerCase().trim();
        const foundAdmin = await Admin.findOne({
            validatedEmail
        });
        if (foundAdmin) {
            return res.status(409).json({
                statusCode: 400,
                status: 'Conflict',
                message: 'Admin already exists'
            });
        }

        const admin = new Admin({
            firstName: firstName.at(0).toUpperCase().trim() + firstName.slice(1).trim(),
            lastName: lastName.toUpperCase().trim(),
            email: validatedEmail,
            password: await hashPassword(password),
            role: 'admin',
        });

        await admin.save();

        res.status(201).json({
            statusCode: 201,
            status: 'success',
            message: 'Admin registered successfully',
            data: admin
        });

    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            status: 'Bad Request',
            message: 'Something went wrong',
            err: {
                message: err.message,
                stack: err.stack
            }
        });
    }
};

/**
 * @desc    login as admin
 * @route   POST /admins/login
 * @access  Public (Admins)
 */
exports.loginAdmin = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const admin = await Admin.findOne({
            email
        });
        if (!admin) {
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Admin not found"
            });
        }

        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "Invalid credentials"
            });
        }

        const accessToken = generateAccessToken(admin._id);
        const refreshToken = generateRefreshToken(admin._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000, //1 day expiration
        });


        res.status(200).json({
            statusCode: 200,
            status: "Success",
            message: "Login successful",
            accessToken
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({
            statusCode: 500,
            status: "Internal Server Error",
            message: "An unexpected error occurred",
            error: err.message
        });
    }
};

/**
 * @desc    logout admin
 * @route   POST /admins/logout
 * @access  Public (Admins)
 */
exports.logoutAdmin = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        res.status(200).json({
            statusCode: 200,
            status: "Success",
            message: "Logged out successfully"
        });

    } catch (err) {
        console.error("Logout Error:", err);
        res.status(500).json({
            statusCode: 500,
            status: "Internal Server Error",
            message: "An unexpected error occurred",
            error: err.message
        });
    }
};


/**
 * @desc    referesh as admin token
 * @route   POST /admins/refresh-token
 * @access  Public (Admins)
 */
exports.refreshAdminToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(403).json({
                statusCode: 403,
                status: "Unauthorized",
                message: "Access Denied"
            });
        }

        const verified = verifyToken(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
        if (!verified) {
            return res.status(403).json({
                statusCode: 403,
                status: "Unauthorized",
                message: "Invalid or expired refresh token"
            });
        }

        const newAccessToken = generateAccessToken(verified.userID);

        res.status(200).json({
            statusCode: 200,
            status: "Success",
            message: "Access token refreshed",
            accessToken: newAccessToken
        });

    } catch (err) {
        console.error("Refresh Token Error:", err);
        res.status(403).json({
            statusCode: 403,
            status: "Unauthorized",
            message: "Invalid or expired refresh token"
        });
    }
};

/**
 * @desc    fetch all admin
 * @route   GET /admins
 * @access  Private (Master Admin Only)
 */
exports.fetchAllAdmins = async (req, res) => {

    const {
        userID: authID
    } = req.user;

    if (!authID) {
        return res.status(403).json({
            statusCode: 403,
            status: 'Unathorized',
            message: 'You are not authorized to perform this action'
        });
    }


    try {
        const admins = await Admin.find({});
        if (!admins) {
            return res.status(404).json({
                statusCode: 404,
                status: 'Not Found',
                message: 'No admin found'
            });
        }

        if (admins.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: 'Not Found',
                message: 'Admins record is empty'
            });
        }

        res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: 'Admins fetched successfully',
            data: admins
        });
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            status: 'Bad Request',
            message: 'Something went wrong',
            err: {
                message: err.message,
                stack: err.stack
            }
        });
    }
};

/**
 * @desc    fetch single admin
 * @route   GET /admins/:adminID
 * @access  Private (Master Admin Only)
 */
exports.fetchAdminByID = async (req, res) => {

    const {
        userID: authID
    } = req.user;

    if (!authID) {
        return res.status(403).json({
            statusCode: 403,
            status: 'Unathorized',
            message: 'You are not authorized to perform this action'
        });
    }

    try {
        const userID = req.params.adminID;

        if (!userID) {
            return res.status(400).json({
                statusCode: 404,
                status: 'Not Found',
                message: 'Admin ID is required'
            });
        }

        const admin = await Admin.findById(userID);
        if (!admin) {
            return res.status(404).json({
                statusCode: 404,
                status: 'Not Found',
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: 'Admin fetched successfully',
            data: admin
        });
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            status: 'Bad Request',
            message: 'Something went wrong',
            err: {
                message: err.message,
                stack: err.stack
            }
        });
    }
};

/**
 * @desc    update admin by ID
 * @route   PATCH /admins/:adminID/update
 * @access  Private (Master Admin Only)
 */
exports.updateAdminByID = async (req, res) => {

    const {
        userID: authID
    } = req.user;

    if (!authID) {
        return res.status(403).json({
            statusCode: 403,
            status: 'Unathorized',
            message: 'You are not authorized to perform this action'
        });
    }

    try {

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        const userID = req.params.adminID;

        if (!userID) {
            return res.status(400).json({
                statusCode: 404,
                status: 'Not Found',
                message: 'Admin ID is required'
            });
        }

        const admin = await Admin.findById(userID);

        if (!admin) {
            return res.status(404).json({
                statusCode: 404,
                status: 'Not Found',
                message: 'Admin not found'
            });
        }

        // const validatedEmail = isValidEmail(email.toLowerCase().trim());
        const validatedEmail = email?.toLowerCase()?.trim();
        if (!validatedEmail) {
            return res.status(400).json({
                statusCode: 400,
                status: 'Bad Request',
                message: 'Invalid email address'
            });
        }

        if (firstName) {
            admin.firstName = firstName?.at(0)?.toUpperCase()?.trim() + firstName?.slice(1)?.trim();
        }
        if (lastName) {
            admin.lastName = lastName?.toUpperCase()?.trim();
        }
        if (email) {
            admin.email = validatedEmail;
        }
        if (password) {
            const isMatch = await comparePassword(password, admin.password);
            if (isMatch) {
                return res.status(400).json({
                    statusCode: 400,
                    status: 'Bad Request',
                    message: 'New password must be different from the old password'
                });
            }
            admin.password = await hashPassword(password);
        }

        await admin.save();
        res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: 'Admin updated successfully',
            data: admin
        });
    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            status: 'Bad Request',
            message: 'Something went wrong',
            err: {
                message: err.message,
                stack: err.stack
            }
        });
    }
};

/**
 * @desc    update admin by ID
 * @route   DELETE /admins/:adminID/delete
 * @access  Private (Master Admin Only)
 */
exports.deleteAdminByID = async (req, res) => {

    const {
        userID: authID
    } = req.user;

    if (!authID) {
        return res.status(403).json({
            statusCode: 403,
            status: 'Unathorized',
            message: 'You are not authorized to perform this action'
        });
    }

    try {

        const userID = req.params.adminID;

        if (!userID) {
            return res.status(400).json({
                statusCode: 404,
                status: 'Not Found',
                message: 'Admin ID is required'
            });
        }

        const admin = await Admin.findByIdAndDelete(userID);

        if (!admin) {
            return res.status(404).json({
                statusCode: 404,
                status: 'Not Found',
                message: 'Admin not found or already deleted'
            });
        }

        res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: `Admin with the email ${admin.email} has been successfully deleted.`,
        });

    } catch (err) {
        res.status(400).json({
            statusCode: 400,
            status: 'Bad Request',
            message: 'Something went wrong',
            err: {
                message: err.message,
                stack: err.stack
            }
        });
    }
};