const express = require("express");

const router = express.Router();

// ========================================
// CONTROLLER
// ========================================

const {
  getDistricts,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} = require("../controllers/district.controller");

// ========================================
// GET ALL
// ========================================

router.get(
  "/",
  getDistricts
);

// ========================================
// GET SINGLE
// ========================================

router.get(
  "/:id",
  getDistrictById
);

// ========================================
// CREATE
// ========================================

router.post(
  "/",
  createDistrict
);

// ========================================
// UPDATE
// ========================================

router.put(
  "/:id",
  updateDistrict
);

// ========================================
// DELETE
// ========================================

router.delete(
  "/:id",
  deleteDistrict
);

module.exports = router;