const express = require("express");

const router = express.Router();

const {
    getTalukas,
    getTalukasByDistrict,
    getTalukaById,
    createTaluka,
    updateTaluka,
    deleteTaluka,
} = require("../controllers/talukaController");


router.get(
    "/",
    getTalukas
);


router.get(
    "/district/:districtId",
    getTalukasByDistrict
);


router.get(
    "/:id",
    getTalukaById
);


router.post(
    "/",
    createTaluka
);


router.put(
    "/:id",
    updateTaluka
);


router.delete(
    "/:id",
    deleteTaluka
);


module.exports = router;