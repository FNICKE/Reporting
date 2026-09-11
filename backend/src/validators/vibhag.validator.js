const { body } = require("express-validator");


// =====================================================
// VIBHAG VALIDATOR
// =====================================================

const vibhagValidator = [

    // HEAD
    body("head")
        .trim()
        .notEmpty()
        .withMessage("Head is required")
        .isLength({
            min: 2,
            max: 100
        })
        .withMessage(
            "Head must be between 2 and 100 characters"
        ),


    // DISTRICT
    body("district_id")
        .notEmpty()
        .withMessage("District is required")
        .isInt()
        .withMessage("District ID must be a valid number"),


    // TALUKA
    body("taluka_id")
        .notEmpty()
        .withMessage("Taluka is required")
        .isInt()
        .withMessage("Taluka ID must be a valid number"),


    // CONTACT NUMBER
    body("contact_number")
        .trim()
        .notEmpty()
        .withMessage("Contact number is required")
        .matches(/^[0-9]{10}$/)
        .withMessage(
            "Contact number must be exactly 10 digits"
        ),


    // USER ID
    body("user_id")
        .trim()
        .notEmpty()
        .withMessage("User ID is required")
        .isLength({
            min: 3,
            max: 100
        })
        .withMessage(
            "User ID must be between 3 and 100 characters"
        ),


    // EMAIL
    body("email")
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),


    // PASSWORD
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({
            min: 6,
            max: 255
        })
        .withMessage(
            "Password must be between 6 and 255 characters"
        ),


    // VIBHAG NAME
    body("vibhag")
        .trim()
        .notEmpty()
        .withMessage("Vibhag name is required")
        .isLength({
            min: 2,
            max: 100
        })
        .withMessage(
            "Vibhag name must be between 2 and 100 characters"
        ),


    // ADDRESS
    body("address")
        .optional({
            values: "null"
        })
        .trim()
        .isLength({
            max: 500
        })
        .withMessage(
            "Address cannot exceed 500 characters"
        ),


    // STATUS
    body("status")
        .optional()
        .isIn([
            "active",
            "inactive"
        ])
        .withMessage(
            "Status must be active or inactive"
        )
];


module.exports = {
    vibhagValidator
};