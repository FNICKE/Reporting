const express = require("express");

const router = express.Router();


// =====================================================
// TRAINER REPORT CONTROLLER
// =====================================================

const {
    getTrainerReports,
    getTrainerReportById,
    createTrainerReport,
    updateTrainerReport,
    deleteTrainerReport,
} = require("../controllers/trainerReport.controller");


// =====================================================
// TRAINER UPLOAD
// =====================================================

const {
    trainerUpload,
} = require("../middleware/upload");


// =====================================================
// GET ALL TRAINER REPORTS
// GET /api/trainer-reports
// =====================================================

router.get(
    "/",
    getTrainerReports
);


// =====================================================
// GET SINGLE TRAINER REPORT
// GET /api/trainer-reports/:id
// =====================================================

router.get(
    "/:id",
    getTrainerReportById
);


// =====================================================
// CREATE TRAINER REPORT
// POST /api/trainer-reports
// =====================================================

router.post(
    "/",
    trainerUpload.fields([
        {
            name: "meeting_photo_1",
            maxCount: 1,
        },
        {
            name: "meeting_photo_2",
            maxCount: 1,
        },
    ]),
    createTrainerReport
);


// =====================================================
// UPDATE TRAINER REPORT
// PUT /api/trainer-reports/:id
// =====================================================

router.put(
    "/:id",
    trainerUpload.fields([
        {
            name: "meeting_photo_1",
            maxCount: 1,
        },
        {
            name: "meeting_photo_2",
            maxCount: 1,
        },
    ]),
    updateTrainerReport
);


// =====================================================
// DELETE TRAINER REPORT
// DELETE /api/trainer-reports/:id
// =====================================================

router.delete(
    "/:id",
    deleteTrainerReport
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;