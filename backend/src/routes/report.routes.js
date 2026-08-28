const express = require("express");

const router = express.Router();

const {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} = require("../controllers/report.controller");

const authenticate = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

const {
  districtUpload,
} = require("../middleware/upload");

// ========================================
// GET ALL
// ========================================

router.get(
  "/",
  authenticate,
  getReports
);

// ========================================
// GET BY ID
// ========================================

router.get(
  "/:id",
  authenticate,
  getReportById
);

// ========================================
// CREATE
// ========================================

router.post(
  "/",
  authenticate,
  allowRoles(
    "admin",
    "district",
    "taluka",
    "vibhag"
  ),
  districtUpload.fields([
    {
      name: "machine1CampPhoto",
      maxCount: 1,
    },
    {
      name: "machine2CampPhoto",
      maxCount: 1,
    },
  ]),
  createReport
);

// ========================================
// UPDATE
// ========================================

router.put(
  "/:id",
  authenticate,
  allowRoles(
    "admin",
    "district",
    "taluka",
    "vibhag"
  ),
  districtUpload.fields([
    {
      name: "machine1CampPhoto",
      maxCount: 1,
    },
    {
      name: "machine2CampPhoto",
      maxCount: 1,
    },
  ]),
  updateReport
);

// ========================================
// DELETE
// ========================================

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin"),
  deleteReport
);

module.exports = router;