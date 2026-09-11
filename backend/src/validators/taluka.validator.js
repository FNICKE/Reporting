const { body } = require("express-validator");

// ========================================
// TALUKA VALIDATOR
// ========================================

const talukaValidator = [

    // NAME
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Taluka name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Taluka name must be between 2 and 100 characters"),

    // DISTRICT
    body("district_id")
        .notEmpty()
        .withMessage("District is required")
        .isInt()
        .withMessage("District ID must be a valid number"),

    // CONTACT NUMBER
    body("contact_number")
        .trim()
        .notEmpty()
        .withMessage("Contact number is required")
        .matches(/^[0-9]{10}$/)
        .withMessage("Contact number must be exactly 10 digits"),

    // USER ID
    body("user_id")
        .trim()
        .notEmpty()
        .withMessage("User ID is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("User ID must be between 3 and 100 characters"),

    // EMAIL
    body("email")
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    // PASSWORD
    body("password")
        .optional({ checkFalsy: true })
        .isLength({ min: 1, max: 255 })
        .withMessage("Password must be at least 1 character"),

    // ADDRESS
    body("address")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Address cannot exceed 500 characters"),
];

module.exports = {
    talukaValidator,
};