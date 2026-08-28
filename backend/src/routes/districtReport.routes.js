const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLER
// =====================================================

const {
    createDistrictReport,
    getDistrictReports,
    getDistrictReportById,
    updateDistrictReport,
    deleteDistrictReport,
} = require("../controllers/districtReport.controller");

// =====================================================
// UPLOAD MIDDLEWARE
// =====================================================

const {
    districtUpload,
} = require("../middleware/upload");

// =====================================================
// GET ALL
// =====================================================

router.get(
    "/",
    getDistrictReports
);

// =====================================================
// GET BY ID
// =====================================================

router.get(
    "/:id",
    getDistrictReportById
);

// =====================================================
// CREATE
// =====================================================

router.post(
    "/",
    districtUpload.fields([
        {
            name: "machine1_camp_photo",
            maxCount: 1,
        },
        {
            name: "machine2_camp_photo",
            maxCount: 1,
        },
    ]),
    createDistrictReport
);

// =====================================================
// UPDATE
// =====================================================

router.put(
    "/:id",
    districtUpload.fields([
        {
            name: "machine1_camp_photo",
            maxCount: 1,
        },
        {
            name: "machine2_camp_photo",
            maxCount: 1,
        },
    ]),
    updateDistrictReport
);

// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    deleteDistrictReport
);

module.exports = router;