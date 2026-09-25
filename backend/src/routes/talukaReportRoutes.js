const express = require("express");

const router = express.Router();


// =====================================================
// CONTROLLER
// =====================================================

const {
    getTalukaReports,
    getTalukaReportById,
    createTalukaReport,
    updateTalukaReport,
    deleteTalukaReport,
} = require("../controllers/talukaReportController");


// =====================================================
// UPLOAD
// =====================================================

const {
    talukaUpload,
} = require("../middleware/upload");


// =====================================================
// GET ALL
// =====================================================

router.get(
    "/",
    getTalukaReports
);


// =====================================================
// GET BY ID
// =====================================================

router.get(
    "/:id",
    getTalukaReportById
);


// =====================================================
// CREATE
// =====================================================

router.post(
    "/",
    talukaUpload.fields([
        {
            name: "meeting_photo_1",
            maxCount: 1,
        },
        {
            name: "meeting_photo_2",
            maxCount: 1,
        },
    ]),
    createTalukaReport
);


// =====================================================
// UPDATE
// =====================================================

router.put(
    "/:id",
    talukaUpload.fields([
        {
            name: "meeting_photo_1",
            maxCount: 1,
        },
        {
            name: "meeting_photo_2",
            maxCount: 1,
        },
    ]),
    updateTalukaReport
);


// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    deleteTalukaReport
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;