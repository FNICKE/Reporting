const express = require("express");

const {
    login,
} = require("../controllers/auth.controller");

const router = express.Router();


// =====================================================
// POST LOGIN
// =====================================================

router.post(
    "/login",
    login
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;