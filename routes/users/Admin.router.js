const express = require("express");
const adminRouter = express.Router();
const {
    registerAdmin,
    fetchAllAdmins,
    fetchAdminByID,
    updateAdminByID,
    deleteAdminByID,
    loginAdmin,
    logoutAdmin,
    refreshAdminToken,
} = require("../../controllers/users/Admin.controller");
const authUser = require("../../middlewares/authUser");

// Admin routes
adminRouter.post("/", authUser, registerAdmin);
adminRouter.get("/", authUser, fetchAllAdmins);
adminRouter.get("/:adminID", authUser, fetchAdminByID);
adminRouter.patch("/:adminID/update", authUser, updateAdminByID);
adminRouter.delete("/:adminID/delete", authUser, deleteAdminByID);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", logoutAdmin);
adminRouter.post("/refresh", refreshAdminToken);

module.exports = adminRouter;