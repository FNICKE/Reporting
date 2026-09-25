const express = require("express");

const router = express.Router();


// =====================================================
// CONTROLLER
// =====================================================

const {
    getTrainers,
    getTrainerById,
    getTrainersByDistrict,
    getTrainersByTaluka,
    getTrainersByVibhag,
    createTrainer,
    updateTrainer,
    deleteTrainer
} = require("../controllers/trainerController");


// =====================================================
// GET ALL TRAINERS
// =====================================================

router.get(
    "/",
    getTrainers
);


// =====================================================
// GET TRAINERS BY DISTRICT
// =====================================================

router.get(
    "/district/:districtId",
    getTrainersByDistrict
);


// =====================================================
// GET TRAINERS BY TALUKA
// =====================================================

router.get(
    "/taluka/:talukaId",
    getTrainersByTaluka
);


// =====================================================
// GET TRAINERS BY VIBHAG
// =====================================================

router.get(
    "/vibhag/:vibhagId",
    getTrainersByVibhag
);


// =====================================================
// GET SINGLE TRAINER
// =====================================================

router.get(
    "/:id",
    getTrainerById
);


// =====================================================
// CREATE TRAINER
// =====================================================

router.post(
    "/",
    createTrainer
);


// =====================================================
// UPDATE TRAINER
// =====================================================

router.put(
    "/:id",
    updateTrainer
);


// =====================================================
// DELETE TRAINER
// =====================================================

router.delete(
    "/:id",
    deleteTrainer
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;