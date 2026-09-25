const { body } = require("express-validator");

// =====================================================
// VIBHAG VALIDATOR
// =====================================================

const vibhagValidator = [

    // HEAD / FULL NAME
    body("head")
        .trim()
        .notEmpty()
        .withMessage("Full Name / Head is required")
        .isLength({
            min: 2,
            max: 100
        })
        .withMessage(
            "Name must be between 2 and 100 characters"
        ),

    // DISTRICT (optional ID or name)
    body("district_id")
        .optional({ nullable: true, checkFalsy: true }),

    body("district_name")
        .optional({ nullable: true, checkFalsy: true }),

    // TALUKA (optional ID or name)
    body("taluka_id")
        .optional({ nullable: true, checkFalsy: true }),

    body("taluka_name")
        .optional({ nullable: true, checkFalsy: true }),

    // CONTACT NUMBER
    body("contact_number")
        .trim()
        .notEmpty()
        .withMessage("Mobile Number is required")
        .matches(/^[0-9]{10}$/)
        .withMessage(
            "Mobile number must be exactly 10 digits"
        ),

    // USER ID
    body("user_id")
        .trim()
        .notEmpty()
        .withMessage("User ID is required")
        .isLength({
            min: 1,
            max: 100
        })
        .withMessage(
            "User ID must be between 1 and 100 characters"
        ),

    // EMAIL
    body("email")
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    // PASSWORD
    body("password")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({
            min: 1,
            max: 255
        })
        .withMessage(
            "Password must be between 1 and 255 characters"
        ),

    // VIBHAG NAME (Optional)
    body("vibhag")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({
            max: 100
        })
        .withMessage(
            "Vibhag name cannot exceed 100 characters"
        ),

    // ADDRESS (Optional)
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

    // STATUS (Optional)
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