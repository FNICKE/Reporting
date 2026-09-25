const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLER
// =====================================================

const {
    createVibhagReport,
    getVibhagReports,
    getVibhagReportById,
    updateVibhagReport,
    deleteVibhagReport,
} = require("../controllers/vibhagReportController");

// =====================================================
// UPLOAD MIDDLEWARE
// =====================================================

const {
    vibhagUpload,
} = require("../middleware/upload");

// =====================================================
// GET ALL VIBHAG REPORTS
// GET /api/vibhag-reports
// =====================================================

router.get(
    "/",
    getVibhagReports
);

// =====================================================
// GET SINGLE VIBHAG REPORT
// GET /api/vibhag-reports/:id
// =====================================================

router.get(
    "/:id",
    getVibhagReportById
);

// =====================================================
// CREATE VIBHAG REPORT
// POST /api/vibhag-reports
// =====================================================

router.post(
    "/",
    vibhagUpload.fields([
        {
            name: "meeting_photo_1",
            maxCount: 1,
        },
        {
            name: "meeting_photo_2",
            maxCount: 1,
        },
    ]),
    createVibhagReport
);

// =====================================================
// UPDATE VIBHAG REPORT
// PUT /api/vibhag-reports/:id
// =====================================================

router.put(
    "/:id",
    vibhagUpload.fields([
        {
            name: "meeting_photo_1",
            maxCount: 1,
        },
        {
            name: "meeting_photo_2",
            maxCount: 1,
        },
    ]),
    updateVibhagReport
);

// =====================================================
// DELETE VIBHAG REPORT
// DELETE /api/vibhag-reports/:id
// =====================================================

router.delete(
    "/:id",
    deleteVibhagReport
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;