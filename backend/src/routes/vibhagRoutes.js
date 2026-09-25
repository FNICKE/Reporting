const express = require("express");

const router = express.Router();

// ========================================
// VIBHAG CONTROLLER
// ========================================

const {
    getVibhags,
    getVibhagById,
    createVibhag,
    updateVibhag,
    deleteVibhag,
} = require("../controllers/vibhagController");

// ========================================
// MIDDLEWARE
// ========================================

const allowRoles = require("../middleware/roleMiddleware");

const validate = require("../middleware/validationMiddleware");

// ========================================
// VALIDATOR
// ========================================

const {
    vibhagValidator,
} = require("../validators/vibhagValidator");

// ========================================
// GET ALL VIBHAGS
// WITHOUT LOGIN
// ========================================

router.get(
    "/",
    getVibhags
);

// ========================================
// GET SINGLE VIBHAG
// WITHOUT LOGIN
// ========================================

router.get(
    "/:id",
    getVibhagById
);

// ========================================
// CREATE VIBHAG
// WITHOUT LOGIN
// ========================================

router.post(
    "/",
    vibhagValidator,
    validate,
    createVibhag
);

// ========================================
// UPDATE VIBHAG
// WITHOUT LOGIN
// ========================================

router.put(
    "/:id",
    vibhagValidator,
    validate,
    updateVibhag
);

// ========================================
// DELETE VIBHAG
// WITHOUT LOGIN
// ========================================

router.delete(
    "/:id",
    deleteVibhag
);

// ========================================
// EXPORT
// ========================================

module.exports = router;